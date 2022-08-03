import { Paging, PagingRecord, PagingUrlParameters } from './types'

const toLimit = (pageSize: number) => (
  `limit ${pageSize}`
)

const toOffset = (paging: PagingRecord) => (
  `offset ${(paging.page - 1) * paging.pageSize}`
)

const toSql = (paging: Paging) => {
  // Page size is required for both limit and offset statements
  if (paging.pageSize == null)
    return null

  return [
    toLimit(paging.pageSize),
    toOffset(paging),
  ].join(' ')
}

const toUrlParams = (paging: PagingRecord): PagingUrlParameters => ({
  page: paging.page?.toString(),
  pageSize: paging.pageSize?.toString(),
})

export const createPaging = (options?: PagingRecord): Paging => {
  let paging: Paging

  return paging = {
    page: options?.page ?? 1,
    pageSize: options?.pageSize,
    updatePage: newPage => paging.page = newPage,
    updatePageSize: newPageSize => paging.pageSize = newPageSize,
    toSql: () => toSql(paging),
    toUrlParams: () => toUrlParams(paging),
  }
}

export const createPagingRecordFromUrlParams = (pagingUrlParams: PagingUrlParameters): PagingRecord => ({
  page: pagingUrlParams.page != null && pagingUrlParams.page.length > 0 ? parseInt(pagingUrlParams.page) : null,
  pageSize: pagingUrlParams.pageSize != null && pagingUrlParams.pageSize.length > 0 ? parseInt(pagingUrlParams.pageSize) : null,
})
