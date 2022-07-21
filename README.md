# data-query

A package for creating a data query, with support to convert to URL parameters and a PostgreSQL statement.

## Usage

Basic usage:

```typescript
import { createDataQuery } from '@samhuk/data-query'
import { Sorting } from '@samhuk/data-query/types'

const dataQuery = createDataQuery({
  page: 5,
  pageSize: 10,
  fieldSortingList: [
    { fieldName: 'dateCreated', sorting: Sorting.DESC }
  ]
})

// -- Reading converted forms (i.e. URL, PostgreSQL)
const urlQueryParameters = dataQuery.urlQueryParameters
// { page: '5', pageSize: '10', orderBy: 'dateCreated-desc' }
const postgreSqlOrderByLimitOffsetSql = dataQuery.pSqlSql.orderByLimitOffset
// "orderBy dateCreated desc limit 10 offset 40"

// -- Modify the data query
dataQuery.updatePage(10)
dataQuery.updatePageSize(5)
dataQuery.updateFieldSortingList([])
```

Creating a data query from url query parameters:

```typescript
import { createFromUrlQueryParameters } from '@samhuk/data-query'

const dataQuery = createFromUrlQueryParameters({
  page: '5',
  pageSize: '10',
  orderBy: 'field1-asc,field2-desc',
})
```
