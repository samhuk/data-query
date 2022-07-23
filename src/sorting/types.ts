export enum SortingDirection {
  ASC = 'asc',
  DESC = 'desc',
}
export type SortingRecord<TFieldNames extends string = string> = { field: TFieldNames, dir: SortingDirection }[] | null

export type SortingUrlParameters = {
  sort: string
}

export type Sorting<TFieldNames extends string = string> = {
  /**
   * The current value of the sorting
   */
  value: SortingRecord<TFieldNames>
  /**
   * Updates the value of the sorting to the given new value.
   */
  update: <TFieldNames2 extends string = string>(newValue: SortingRecord<TFieldNames2 | TFieldNames>) => void
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
