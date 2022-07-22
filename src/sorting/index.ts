import { Sorting, SortingRecord, SortingUrlParameters } from './types'

const toSql = (record: SortingRecord): string => (
  (record != null && record.length > 0)
    ? `order by ${record
      .filter(fs => fs.sorting != null)
      .map(fs => `"${fs.field}" ${fs.sorting}`)
      .join(', ')}`
    : ''
)

const toUrlParams = (sorting: SortingRecord): SortingUrlParameters => ({
  sort: sorting
    .filter(fs => fs.sorting != null)
    .map(fs => `${fs.field}-${fs.sorting}`).join(','),
})

// TODO: Write fromUrlParameters logic
// const deserializeFieldSortingList = (fieldSortingListString: string): Sorting[] => {
//   const regex = /([a-zA-Z0-9]*)-(asc|desc),?/g
//   const fieldSorting: FieldSorting[] = []

//   let result = null
//   // eslint-disable-next-line no-cond-assign
//   while ((result = regex.exec(fieldSortingListString)) != null)
//     fieldSorting.push({ field: result[1], sorting: result[2] as SortingDirection })

//   return fieldSorting
// }

export const createSorting = (options: SortingRecord): Sorting => {
  let sorting: Sorting

  return sorting = {
    value: options,
    update: newValue => sorting.value = newValue,
    toSql: () => toSql(sorting.value),
    toUrlParams: () => toUrlParams(sorting.value),
  }
}
