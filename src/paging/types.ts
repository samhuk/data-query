export type PagingRecord = {
  page?: number
  pageSize?: number
}

export type PagingUrlParameters = {
  page: string
  pageSize: string
}

export type Paging = {
  page: number | null
  pageSize: number | null
  updatePage: (newPage: number) => void
  updatePageSize: (newPageSize: number) => void
  toSql: () => string
  toUrlParams: () => PagingUrlParameters
}
