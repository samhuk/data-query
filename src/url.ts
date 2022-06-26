import { DataQueryRecord, DataQueryUrl, DataQueryUrlQueryParameters, FieldSorting, Sorting } from './types'

/**
 * @example
 * serializeFieldSortingList([{ fieldName: 'a', sorting: ASC },{ fieldName: 'b', sorting: DESC }])
 * // 'a-asc,b-desc'
 */
const serializeFieldSortingList = (fieldSortingList: FieldSorting[]): string => (
  fieldSortingList
    .filter(fs => fs.sorting != null && fs.sorting !== Sorting.NONE)
    .map(fs => `${fs.fieldName}-${fs.sorting}`).join(',')
)

const deserializeFieldSortingList = (fieldSortingListString: string): FieldSorting[] => {
  const regex = /([a-zA-Z0-9]*)-(asc|desc),?/g
  const fieldSorting: FieldSorting[] = []

  let result = null
  // eslint-disable-next-line no-cond-assign
  while ((result = regex.exec(fieldSortingListString)) != null)
    fieldSorting.push({ fieldName: result[1], sorting: result[2] as Sorting })

  return fieldSorting
}

export const convertUrlQueryParametersToRecord = (queryParameters: { [key: string]: string }): DataQueryRecord => ({
  page: queryParameters.page != null ? parseInt(queryParameters.page) : null,
  pageSize: queryParameters.pageSize != null ? parseInt(queryParameters.pageSize) : null,
  fieldSortingList: deserializeFieldSortingList(queryParameters.orderBy),
})

const convertQueryParametersToQueryParametersString = (
  queryParameters: DataQueryUrlQueryParameters,
): string => [
  queryParameters.orderBy != null
    ? `orderBy=${queryParameters.orderBy}`
    : null,
  queryParameters.page != null
    ? `page=${queryParameters.page}`
    : null,
  queryParameters.pageSize != null
    ? `pageSize=${queryParameters.pageSize}`
    : null,
].filter(item => item != null).join('&')

const convertRecordToQueryParameters = (record: DataQueryRecord) => ({
  orderBy: serializeFieldSortingList(record.fieldSortingList),
  page: (record.page ?? 1).toString(),
  pageSize: (record.pageSize ?? 20).toString(),
})

export const createDataQueryUrl = (record: DataQueryRecord): DataQueryUrl => {
  let instance: DataQueryUrl
  const initialQueryParameters = convertRecordToQueryParameters(record)

  return instance = {
    queryParameters: initialQueryParameters,
    queryParametersString: convertQueryParametersToQueryParametersString(initialQueryParameters),
    updateRecord: newRecord => {
      instance.queryParameters = convertRecordToQueryParameters(newRecord)
      instance.queryParametersString = convertQueryParametersToQueryParametersString(instance.queryParameters)
    },
    updateFieldSortingList: newFieldSortingList => {
      instance.queryParameters.orderBy = serializeFieldSortingList(newFieldSortingList)
      instance.queryParametersString = convertQueryParametersToQueryParametersString(instance.queryParameters)
    },
    updatePage: newPage => {
      instance.queryParameters.page = (newPage ?? 1).toString()
      instance.queryParametersString = convertQueryParametersToQueryParametersString(instance.queryParameters)
    },
    updatePageSize: newPageSize => {
      instance.queryParameters.pageSize = (newPageSize ?? 20).toString()
      instance.queryParametersString = convertQueryParametersToQueryParametersString(instance.queryParameters)
    },
  }
}
