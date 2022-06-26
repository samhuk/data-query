import { DataQueryRecord, FieldSorting, Paging, DataQueryPSql, Sorting } from './types'

type PSqlOrderByLimitOffset = {
  orderBy: string
  limit: string
  offset: string
}

const convertFieldSortingListToOrderBy = (fieldSortingList: FieldSorting[]): string => (
  (fieldSortingList != null && fieldSortingList.length > 0)
    ? `order by ${fieldSortingList
      .filter(fs => fs.sorting != null && fs.sorting !== Sorting.NONE)
      .map(fs => `${fs.fieldName.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)} ${fs.sorting}`)
      .join(',')}`
    : ''
)

const convertPageSizeToLimit = (pageSize: number) => (
  `limit ${pageSize}`
)

const convertPagingToOffset = (paging: Paging) => (
  `offset ${(paging.page - 1) * paging.pageSize}`
)

const convertPSqlOBLOToPSql = (pSqlOBLO: PSqlOrderByLimitOffset) => (
  [
    pSqlOBLO.orderBy,
    pSqlOBLO.limit,
    pSqlOBLO.offset,
  ].join(' ').trim()
)

const convertRecordToPSqlOBLO = (record: DataQueryRecord): PSqlOrderByLimitOffset => ({
  orderBy: convertFieldSortingListToOrderBy(record.fieldSortingList),
  limit: convertPageSizeToLimit(record.pageSize),
  offset: convertPagingToOffset(record),
})

export const createDataQueryPSql = (record: DataQueryRecord): DataQueryPSql => {
  let instance: DataQueryPSql
  let pSqlOBLO = convertRecordToPSqlOBLO(record)
  let page: number = record.page
  let pageSize: number = record.pageSize

  return instance = {
    orderByLimitOffset: convertPSqlOBLOToPSql(pSqlOBLO),
    updateRecord: newRecord => {
      page = newRecord.page
      pageSize = newRecord.pageSize
      pSqlOBLO = convertRecordToPSqlOBLO({
        page, pageSize, fieldSortingList: newRecord.fieldSortingList,
      })
      instance.orderByLimitOffset = convertPSqlOBLOToPSql(pSqlOBLO)
    },
    updateFieldSortingList: newFieldSortingList => {
      pSqlOBLO.orderBy = convertFieldSortingListToOrderBy(newFieldSortingList)
      instance.orderByLimitOffset = convertPSqlOBLOToPSql(pSqlOBLO)
    },
    updatePage: newPage => {
      page = newPage
      pSqlOBLO.offset = convertPagingToOffset({ page, pageSize })
      instance.orderByLimitOffset = convertPSqlOBLOToPSql(pSqlOBLO)
    },
    updatePageSize: newPageSize => {
      pageSize = newPageSize
      pSqlOBLO.offset = convertPagingToOffset({ page, pageSize })
      pSqlOBLO.limit = convertPageSizeToLimit(pageSize)
      instance.orderByLimitOffset = convertPSqlOBLOToPSql(pSqlOBLO)
    },
  }
}
