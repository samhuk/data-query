import { DataFilterNodeOrGroup } from '@samhuk/data-filter/dist/types'
import { PagingRecord } from './paging/types'
import { SortingRecord } from './sorting/types'

export type DataQueryRecord = PagingRecord & {
  sorting?: SortingRecord
  filter?: DataFilterNodeOrGroup
}

export type DataQueryOptions = DataQueryRecord

export type DataQuerySql = {
  /**
   * The ORDER BY, LIMIT, and OFFSET SQL statement
   */
  orderByLimitOffset: string
  /**
   * The WHERE SQL clause
   */
  where: string
  /**
   * `orderByLimitOffset` and `where` concatenated together.
   *
   * This is useful if the SQL query does not require any statements between
   * the order by, limit, or offset, and the where (i.e. group by, etc.).
   */
  orderByLimitOffsetWhere: string
}

export type DataQueryUrlParameters = {
  page: string
  pageSize: string
  sort: string
  filter: string
}

export type ToSqlOptions = {
  /**
   * Determines whether "WHERE" will be included in the SQL statement.
   *
   * This is useful if the where statement needs to be combined with
   * other, external, custom, where statements.
   *
   * @default true
   */
  includeWhereWord?: boolean
}

export type DataQuery = {
  page: number | null
  pageSize: number | null
  sorting: SortingRecord | null
  filter: DataFilterNodeOrGroup | null
  /**
   * Updates the data query value.
   */
  update: (newValue: DataQueryRecord) => DataQuery
  /**
   * Updates the page of the data query.
   */
  updatePage: (newPage: number) => DataQuery
  /**
   * Updates the page size of the data query.
   */
  updatePageSize: (newPageSize: number) => DataQuery
  /**
   * Updates the sorting of the data query.
   */
  updateSorting: (newSorting: SortingRecord) => DataQuery
  /**
   * Updates the data filter of the data query.
   */
  updateFilter: (newFilter: DataFilterNodeOrGroup) => DataQuery
  /**
   * Converts the current value of the data query to SQL statements.
   */
  toSql: (options?: ToSqlOptions) => DataQuerySql
  /**
   * Converts the current value of the data query to URL query parameters.
   */
  toUrlParams: () => DataQueryUrlParameters
  /**
   * Converts the current value of the data query to a URL query parameters string.
   */
  toUrlParamsString: () => string
  /**
   * Updates the current value of the data query according to the given data query URL parameters.
   */
  fromUrlParams: (urlParams: DataQueryUrlParameters) => DataQuery
}
