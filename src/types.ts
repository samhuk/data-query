export enum Sorting {
  NONE = 'none',
  ASC = 'asc',
  DESC = 'desc'
}

export type FieldSorting = {
  fieldName: string
  sorting: Sorting
}

export type DataQueryOptions = DataQueryRecord

export type DataQueryPSql = DataQueryPSqlSql & {
  updateRecord: (newRecord: DataQueryRecord) => void
  updatePage: (newPage: number) => void
  updatePageSize: (newPageSize: number) => void
  updateFieldSortingList: (newFieldSortingList: FieldSorting[]) => void
}

export type Paging = {
  page: number
  pageSize: number
}

export type DataQueryRecord = Paging & {
  fieldSortingList: FieldSorting[]
}

export type DataQueryPSqlSql = {
  /**
   * The ORDER BY, LIMIT, and OFFSET psql
   */
  orderByLimitOffset: string
}

export type DataQueryUrlQueryParameters = {
  page: string
  pageSize: string
  orderBy: string
}

export type DataQueryUrl = {
  queryParameters: DataQueryUrlQueryParameters
  queryParametersString: string
  updateRecord: (newRecord: DataQueryRecord) => void
  updatePage: (newPage: number) => void
  updatePageSize: (newPageSize: number) => void
  updateFieldSortingList: (newFieldSortingList: FieldSorting[]) => void
}

export type DataQuery = DataQueryRecord & {
  updateRecord: (newRecord: DataQueryRecord) => void
  updatePage: (newPage: number) => void
  updatePageSize: (newPageSize: number) => void
  updateFieldSortingList: (newFieldSortingList: FieldSorting[]) => void
  pSqlSql: DataQueryPSqlSql
  urlQueryParameters: DataQueryUrlQueryParameters
  urlQueryParametersString: string
}
