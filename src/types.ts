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
  update: (newValue: DataQueryRecord) => void
  /**
   * Updates the page of the data query.
   */
  updatePage: (newPage: number) => void
  /**
   * Updates the page size of the data query.
   */
  updatePageSize: (newPageSize: number) => void
  /**
   * Updates the sorting of the data query.
   */
  updateSorting: (newSorting: SortingRecord) => void
  /**
   * Updates the data filter of the data query.
   */
  updateFilter: (newFilter: DataFilterNodeOrGroup) => void
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
}
