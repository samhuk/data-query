import { createDataFilter } from '@samhuk/data-filter'
import { DataFilter, DataFilterNodeOrGroup, ToSqlResult } from '@samhuk/data-filter/dist/types'
import { createSorting, createSortingRecordFromUrlParam } from './sorting'
import { createPaging, createPagingRecordFromUrlParams } from './paging'
import { DataQuery, DataQueryOptions, DataQueryRecord, DataQuerySql, DataQueryUrlParameters, ToSqlOptions } from './types'
import { Sorting } from './sorting/types'
import { Paging } from './paging/types'

const joinOrNullIfEmpty = (strs: string[] | null, joinString: string) => {
  if (strs == null)
    return null

  const validStrs = strs.filter(s => s != null && s.length > 0)

  return validStrs.length === 0
    ? null
    : validStrs.join(joinString)
}

const toSql = (sorting: Sorting, paging: Paging, dataFilter: DataFilter, options?: ToSqlOptions): DataQuerySql => {
  const orderByLimitOffset = joinOrNullIfEmpty([
    sorting.toSql({ transformer: options?.sortingTransformer }),
    paging.toSql(),
  ], ' ')
  const useParameters = !(options?.inlineValues ?? false)
  const whereClauseSql = dataFilter.toSql({
    transformer: options?.filterTransformer,
    useParameters,
    parameterStartIndex: options?.parameterStartIndex,
  })

  let whereClauseSqlText: string
  let values: any[]
  if (useParameters) {
    const _whereClauseSqlText = whereClauseSql as ToSqlResult<true>
    whereClauseSqlText = _whereClauseSqlText.sql
    values = _whereClauseSqlText.values
  }
  else {
    whereClauseSqlText = whereClauseSql as string
  }
  const whereStatementSql = whereClauseSqlText != null
    ? `${(options?.includeWhereWord ?? true) ? 'where ' : ''}${whereClauseSqlText}`
    : null

  return {
    orderByLimitOffset,
    where: whereStatementSql,
    whereOrderByLimitOffset: joinOrNullIfEmpty([
      whereStatementSql,
      orderByLimitOffset,
    ], ' '),
    values,
  }
}

const dataFilterToUrlParamValue = (df: DataFilter): string => {
  const json = df.toJson()
  return json === 'null' ? '' : encodeURI(json)
}

const toUrlParams = (sorting: Sorting, paging: Paging, dataFilter: DataFilter): DataQueryUrlParameters => ({
  ...paging.toUrlParams(),
  ...sorting.toUrlParams(),
  filter: dataFilterToUrlParamValue(dataFilter),
})

const toUrlParamsString = (sorting: Sorting, paging: Paging, dataFilter: DataFilter): string => {
  const params = toUrlParams(sorting, paging, dataFilter)

  return Object.entries(params)
    .filter(([k, v]) => v != null)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
}

const createDataQueryRecordFromUrlParams = <TFieldNames extends string = string>(
  urlParams: DataQueryUrlParameters,
): DataQueryRecord<TFieldNames> => {
  const sortingRecord = createSortingRecordFromUrlParam<TFieldNames>(urlParams.sort)
  const pagingRecord = createPagingRecordFromUrlParams(urlParams)
  const dataFilterNodeOrGroup = urlParams.filter != null && urlParams.filter.length > 0
    ? JSON.parse(decodeURI(urlParams.filter)) as DataFilterNodeOrGroup<TFieldNames>
    : null
  return {
    page: pagingRecord.page,
    pageSize: pagingRecord.pageSize,
    sorting: sortingRecord,
    filter: dataFilterNodeOrGroup,
  }
}

export const createDataQuery = <TFieldNames extends string = string>(
  options?: DataQueryOptions<TFieldNames>,
): DataQuery<TFieldNames> => {
  let dataQuery: DataQuery<TFieldNames>
  const sorting = createSorting<TFieldNames>(options?.sorting)
  const paging = createPaging(options)
  const dataFilter = createDataFilter<TFieldNames>(options?.filter)

  return dataQuery = {
    sorting: options?.sorting,
    page: options?.page,
    pageSize: options?.pageSize,
    filter: options?.filter,
    toSql: _options => toSql(sorting, paging, dataFilter as any, _options) as any,
    toUrlParams: () => toUrlParams(sorting, paging, dataFilter as any),
    toUrlParamsString: () => toUrlParamsString(sorting, paging, dataFilter as any),
    fromUrlParams: (urlParams: DataQueryUrlParameters) => {
      const record = createDataQueryRecordFromUrlParams(urlParams)
      return dataQuery.update(record as any)
    },
    update: newRecord => dataQuery
      .updateSorting(newRecord.sorting)
      .updatePage(newRecord.page)
      .updatePageSize(newRecord.pageSize)
      .updateFilter(newRecord.filter) as any,
    updateSorting: newSorting => {
      sorting.update(newSorting)
      dataQuery.sorting = sorting.value
      return dataQuery
    },
    updateFilter: newFilterNodeOrGroup => {
      dataFilter.updateFilter(newFilterNodeOrGroup as any)
      dataQuery.filter = dataFilter.value
      return dataQuery as any
    },
    updatePage: newPage => {
      paging.updatePage(newPage)
      dataQuery.page = paging.page
      return dataQuery
    },
    updatePageSize: newPageSize => {
      paging.updatePageSize(newPageSize)
      dataQuery.pageSize = paging.pageSize
      return dataQuery
    },
  }
}
