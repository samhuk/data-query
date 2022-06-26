/* This is the entrypoint ts file for the component.
 */

import { createDataQueryPSql } from './psql'
import { DataQuery, DataQueryOptions, DataQueryPSql, DataQueryUrl } from './types'
import { convertUrlQueryParametersToRecord, createDataQueryUrl } from './url'

export const createDataQuery = (options: DataQueryOptions): DataQuery => {
  let instance: DataQuery
  const dataQueryPSql: DataQueryPSql = createDataQueryPSql(options)
  const dataQueryUrl: DataQueryUrl = createDataQueryUrl(options)

  return instance = {
    fieldSortingList: options.fieldSortingList,
    page: options.page,
    pageSize: options.pageSize,
    updateRecord: newRecord => {
      instance.fieldSortingList = newRecord.fieldSortingList
      instance.page = newRecord.page
      instance.pageSize = newRecord.pageSize
      dataQueryPSql.updateRecord(instance)
      dataQueryUrl.updateRecord(instance)
      instance.pSqlSql.orderByLimitOffset = dataQueryPSql.orderByLimitOffset
      instance.urlQueryParameters = dataQueryUrl.queryParameters
      instance.urlQueryParametersString = dataQueryUrl.queryParametersString
    },
    updateFieldSortingList: newFieldSortingList => {
      instance.fieldSortingList = newFieldSortingList
      dataQueryPSql.updateFieldSortingList(instance.fieldSortingList)
      dataQueryUrl.updateFieldSortingList(instance.fieldSortingList)
      instance.pSqlSql.orderByLimitOffset = dataQueryPSql.orderByLimitOffset
    },
    updatePage: newPage => {
      instance.page = newPage
      dataQueryPSql.updatePage(instance.page)
      dataQueryUrl.updatePage(instance.page)
      instance.pSqlSql.orderByLimitOffset = dataQueryPSql.orderByLimitOffset
    },
    updatePageSize: newPageSize => {
      instance.pageSize = newPageSize
      dataQueryPSql.updatePageSize(instance.pageSize)
      dataQueryUrl.updatePageSize(instance.pageSize)
      instance.pSqlSql.orderByLimitOffset = dataQueryPSql.orderByLimitOffset
    },
    pSqlSql: {
      orderByLimitOffset: dataQueryPSql.orderByLimitOffset,
    },
    urlQueryParameters: dataQueryUrl.queryParameters,
    urlQueryParametersString: dataQueryUrl.queryParametersString,
  }
}

export const createFromUrlQueryParameters = (urlQueryParameters: { [x: string]: string }): DataQuery => {
  const record = convertUrlQueryParametersToRecord(urlQueryParameters)
  const options = record
  return createDataQuery(options)
}
