export enum SortingDirection {
  ASC = 'asc',
  DESC = 'desc',
}
export type SortingRecord = { field: string, dir: SortingDirection }[] | null

export type SortingUrlParameters = {
  sort: string
}

export type Sorting = {
  /**
   * The current value of the sorting
   */
  value: SortingRecord
  /**
   * Updates the value of the sorting to the given new value.
   */
  update: (newValue: SortingRecord) => void
  /**
   * Converts the current sorting value to an SQL ORDER BY statement.
   *
   * @example
   * sorting.toSql() // "order by "field1" asc, "field2" desc, "field3" asc"
   */
  toSql: () => string
  /**
   * Converts the current sorting value to a URL query parameter.
   *
   * @example
   * sorting.toUrlParams() // "field1-asc,field2-desc,field3-asc"
   */
  toUrlParams: () => SortingUrlParameters
}
