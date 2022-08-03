export enum SortingDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortingRecordItem<TFieldNames extends string = string> = { field: TFieldNames, dir: SortingDirection }

export type SortingRecord<TFieldNames extends string = string> = SortingRecordItem<TFieldNames>[] | null

export type SortingUrlParameters = {
  sort: string
}

export type SortingSqlTransformer = (sortingRecordItem: SortingRecordItem) => { left?: string } | null

export type ToSqlOptions = {
  /**
   * Optional transformer to use to translate a sorting record item (field name and sorting direction)
   * into the left-hand-side of a SQL ORDER BY sorting item, i.e. the "field1" in `"field1" ASC`.
   */
  transformer?: SortingSqlTransformer
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
  toSql: (options?: ToSqlOptions) => string | null
  /**
   * Converts the current sorting value to a URL query parameter.
   *
   * @example
   * sorting.toUrlParams() // "field1-asc,field2-desc,field3-asc"
   */
  toUrlParams: () => SortingUrlParameters
}
