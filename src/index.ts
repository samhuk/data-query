import { createDataFilter } from '@samhuk/data-filter'
import { DataFilter, DataFilterNodeOrGroup } from '@samhuk/data-filter/dist/types'
import { createSorting, createSortingRecordFromUrlParam } from './sorting'
import { createPaging, createPagingRecordFromUrlParams } from './paging'
import { DataQuery, DataQueryOptions, DataQueryRecord, DataQuerySql, DataQueryUrlParameters, ToSqlOptions } from './types'
import { Sorting } from './sorting/types'
import { Paging } from './paging/types'

const toSql = (sorting: Sorting, paging: Paging, dataFilter: DataFilter, options?: ToSqlOptions): DataQuerySql => {
  const orderByLimitOffset = [
    sorting.toSql({ transformer: options?.sortingTransformer }),
    paging.toSql(),
  ].join(' ')
  const whereClauseSql = dataFilter.toSql({ transformer: options?.filterTransformer })
  const whereStatementSql = whereClauseSql != null
    ? `${(options?.includeWhereWord ?? true) ? 'where ' : ''}${whereClauseSql}`
    : null
  return {
    orderByLimitOffset,
    where: whereStatementSql,
    whereOrderByLimitOffset: [
      whereStatementSql,
      orderByLimitOffset,
    ].filter(s => s != null && s.length > 0).join(' '),
  }
}

const toUrlParams = (sorting: Sorting, paging: Paging, dataFilter: DataFilter): DataQueryUrlParameters => ({
  ...paging.toUrlParams(),
  ...sorting.toUrlParams(),
  filter: encodeURI(dataFilter.toJson()),
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
  const dataFilterNodeOrGroup = JSON.parse(decodeURI(urlParams.filter)) as DataFilterNodeOrGroup<TFieldNames>
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
    toSql: _options => toSql(sorting, paging, dataFilter as any, _options),
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
