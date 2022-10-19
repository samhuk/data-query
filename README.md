# data-query

A package for creating data queries with paging, sorting, and filtering, with URL and SQL serialization.

## Usage

`npm i @samhuk/data-query`

```typescript
import { createDataQuery } from '@samhuk/data-query'
import { Operator, DataFilterLogic } from '@samhuk/data-filter/types'

const dq = createDataQuery({
  page: 5,
  pageSize: 10,
  sorting: [{ field: 'user_id', dir: 'asc' }],
  filter: {
    field: 'date_deleted',
    op: '!=',
    val: null,
  }
})

// Convert to/from SQL and URL params
const sql = dq.toSql()
const urlParams = dq.toUrlParams()
const urlParamsString = dq.toUrlParamsString()
const dq1FromUrlParams = createDataQuery().fromUrlParams(urlParams)

// Update parts of the data query
dq1FromUrlParams.updatePage(6).updatePageSize(11)
```

See the JSDocs for more information on the available options and other capabilities.

## Development

`npm i`

`npm start` - Start a hot reloading tsc build.

`npm run check` - Run linting, unit tests, and tsc build.
