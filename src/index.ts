import { createDataFilter } from '@samhuk/data-filter'
import { DataFilter } from '@samhuk/data-filter/dist/types'
import { createSorting } from './sorting'
import { createPaging } from './paging'
import { DataQuery, DataQueryOptions, DataQuerySql, DataQueryUrlParameters, ToSqlOptions } from './types'
import { Sorting } from './sorting/types'
import { Paging } from './paging/types'

const toSql = (sorting: Sorting, paging: Paging, dataFilter: DataFilter, options?: ToSqlOptions): DataQuerySql => ({
  orderByLimitOffset: [
    sorting.toSql(),
    paging.toSql(),
  ].join(' '),
  where: ((options?.includeWhereWord ?? true) ? 'where ' : '').concat(dataFilter.toSql()),
})

const toUrlParams = (sorting: Sorting, paging: Paging, dataFilter: DataFilter): DataQueryUrlParameters => ({
  ...paging.toUrlParams(),
  ...sorting.toUrlParams(),
  filter: undefined, // TODO
})

const toUrlParamsString = (sorting: Sorting, paging: Paging, dataFilter: DataFilter): string => {
  const params = toUrlParams(sorting, paging, dataFilter)

  return Object.entries(params)
    .filter(([k, v]) => v != null)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
}

export const createDataQuery = (options: DataQueryOptions): DataQuery => {
  let dataQuery: DataQuery
  const sorting = createSorting(options.sorting)
  const paging = createPaging(options)
  const dataFilter = createDataFilter(options.filter)

  return dataQuery = {
    sorting: options.sorting,
    page: options.page,
    pageSize: options.pageSize,
    filter: options.filter,
    toSql: _options => toSql(sorting, paging, dataFilter, _options),
    toUrlParams: () => toUrlParams(sorting, paging, dataFilter),
    toUrlParamsString: () => toUrlParamsString(sorting, paging, dataFilter),
    update: newValue => {
      dataQuery.updateSorting(newValue.sorting)
      dataQuery.updatePage(newValue.page)
      dataQuery.updatePageSize(newValue.pageSize)
      dataQuery.updateFilter(newValue.filter)
    },
    updateSorting: newSorting => {
      sorting.update(newSorting)
      dataQuery.sorting = sorting.value
    },
    updateFilter: newFilterNodeOrGroup => {
      dataFilter.updateFilter(newFilterNodeOrGroup)
      dataQuery.filter = dataFilter.value
    },
    updatePage: newPage => {
      paging.updatePage(newPage)
      dataQuery.page = paging.page
    },
    updatePageSize: newPageSize => {
      paging.updatePageSize(newPageSize)
      dataQuery.pageSize = paging.pageSize
    },
  }
}
