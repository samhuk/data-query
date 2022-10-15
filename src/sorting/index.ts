import { Sorting, SortingDirection, SortingRecord, SortingUrlParameters, ToSqlOptions } from './types'

const toSql = (record: SortingRecord, options?: ToSqlOptions): string | null => (
  (record != null && record.length > 0)
    ? `order by ${record
      .filter(fs => fs.dir != null)
      .map(fs => {
        const transformerResult = options?.transformer?.(fs)
        const left = transformerResult?.left ?? `"${fs.field}"`
        return `${left} ${fs.dir}`
      })
      .join(', ')}`
    : null
)

const toUrlParams = (sorting: SortingRecord): SortingUrlParameters => ({
  sort: sorting
    .filter(fs => fs.dir != null)
    .map(fs => `${fs.field}-${fs.dir}`).join(','),
})

export const createSorting = <TFieldNames extends string = string>(
  options?: SortingRecord<TFieldNames>,
): Sorting<TFieldNames> => {
  let sorting: Sorting

  return sorting = {
    value: options ?? [],
    update: newValue => sorting.value = newValue ?? [],
    toSql: _options => toSql(sorting.value, _options),
    toUrlParams: () => toUrlParams(sorting.value),
  }
}

export const createSortingRecordFromUrlParam = <TFieldNames extends string = string>(
  sortingUrlParamValue: string,
): SortingRecord<TFieldNames> => {
  const regex = /([a-zA-Z0-9]*)-(asc|desc),?/g
  const sortingRecord: SortingRecord<TFieldNames> = []

  let result = null
  // eslint-disable-next-line no-cond-assign
  while ((result = regex.exec(sortingUrlParamValue)) != null)
    sortingRecord.push({ field: result[1] as TFieldNames, dir: result[2] as SortingDirection })

  return sortingRecord
}
