import { createDataFilter } from '@samhuk/data-filter'
import { DataFilter } from '@samhuk/data-filter/dist/types'
import { createSorting, createSortingRecordFromUrlParam } from './sorting'
import { createPaging, createPagingRecordFromUrlParams } from './paging'
import { DataQuery, DataQueryOptions, DataQueryRecord, DataQuerySql, DataQueryUrlParameters, ToSqlOptions } from './types'
import { Sorting } from './sorting/types'
import { Paging } from './paging/types'

const toSql = (sorting: Sorting, paging: Paging, dataFilter: DataFilter, options?: ToSqlOptions): DataQuerySql => {
  const orderByLimitOffset = [
    sorting.toSql(),
    paging.toSql(),
  ].join(' ')
  const where = `${(options?.includeWhereWord ?? true) ? 'where ' : ''}${dataFilter.toSql()}`
  return {
    orderByLimitOffset,
    where,
    orderByLimitOffsetWhere: `${orderByLimitOffset} ${where}`,
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

const createDataQueryRecordFromUrlParams = (urlParams: DataQueryUrlParameters): DataQueryRecord => {
  const sortingRecord = createSortingRecordFromUrlParam(urlParams.sort)
  const pagingRecord = createPagingRecordFromUrlParams(urlParams)
  const dataFilterNodeOrGroup = JSON.parse(decodeURI(urlParams.filter))
  return {
    page: pagingRecord.page,
    pageSize: pagingRecord.pageSize,
    sorting: sortingRecord,
    filter: dataFilterNodeOrGroup,
  }
}

export const createDataQuery = (options?: DataQueryOptions): DataQuery => {
  let dataQuery: DataQuery
  const sorting = createSorting(options?.sorting)
  const paging = createPaging(options)
  const dataFilter = createDataFilter(options?.filter)

  return dataQuery = {
    sorting: options?.sorting,
    page: options?.page,
    pageSize: options?.pageSize,
    filter: options?.filter,
    toSql: _options => toSql(sorting, paging, dataFilter, _options),
    toUrlParams: () => toUrlParams(sorting, paging, dataFilter),
    toUrlParamsString: () => toUrlParamsString(sorting, paging, dataFilter),
    fromUrlParams: (urlParams: DataQueryUrlParameters) => {
      const record = createDataQueryRecordFromUrlParams(urlParams)
      dataQuery.update(record)
      return dataQuery
    },
    update: newRecord => {
      dataQuery.updateSorting(newRecord.sorting)
      dataQuery.updatePage(newRecord.page)
      dataQuery.updatePageSize(newRecord.pageSize)
      dataQuery.updateFilter(newRecord.filter)
      return dataQuery
    },
    updateSorting: newSorting => {
      sorting.update(newSorting)
      dataQuery.sorting = sorting.value
      return dataQuery
    },
    updateFilter: newFilterNodeOrGroup => {
      dataFilter.updateFilter(newFilterNodeOrGroup)
      dataQuery.filter = dataFilter.value
      return dataQuery
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
