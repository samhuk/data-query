import { createDataQuery, createFromUrlQueryParameters } from '.'
import { Sorting } from './types'

describe('createDataQuery', () => {
  const fn = createDataQuery

  test('basic initialization', () => {
    const instance = fn({
      page: 1,
      pageSize: 1,
      fieldSortingList: [
        { fieldName: 'field1', sorting: Sorting.ASC },
        { fieldName: 'field2', sorting: Sorting.DESC },
        { fieldName: 'field3', sorting: Sorting.NONE },
      ],
    })

    expect(instance.page).toBe(1)
    expect(instance.pageSize).toBe(1)
    expect(instance.fieldSortingList).toEqual([
      { fieldName: 'field1', sorting: Sorting.ASC },
      { fieldName: 'field2', sorting: Sorting.DESC },
      { fieldName: 'field3', sorting: Sorting.NONE },
    ])
    expect(instance.pSqlSql.orderByLimitOffset).toBe('order by field1 asc,field2 desc limit 1 offset 0')
    expect(instance.urlQueryParameters.orderBy).toBe('field1-asc,field2-desc')
    expect(instance.urlQueryParameters.page).toBe('1')
    expect(instance.urlQueryParameters.pageSize).toBe('1')
  })

  test('updatePage', () => {
    const instance = fn({
      page: 1,
      pageSize: 1,
      fieldSortingList: [
        { fieldName: 'field1', sorting: Sorting.ASC },
        { fieldName: 'field2', sorting: Sorting.DESC },
        { fieldName: 'field3', sorting: Sorting.NONE },
      ],
    })

    instance.updatePage(2)

    expect(instance.page).toBe(2)
    expect(instance.pageSize).toBe(1)
    expect(instance.fieldSortingList).toEqual([
      { fieldName: 'field1', sorting: Sorting.ASC },
      { fieldName: 'field2', sorting: Sorting.DESC },
      { fieldName: 'field3', sorting: Sorting.NONE },
    ])
    expect(instance.pSqlSql.orderByLimitOffset).toBe('order by field1 asc,field2 desc limit 1 offset 1')
    expect(instance.urlQueryParameters.orderBy).toBe('field1-asc,field2-desc')
    expect(instance.urlQueryParameters.page).toBe('2')
    expect(instance.urlQueryParameters.pageSize).toBe('1')
  })

  test('updatePageSize', () => {
    const instance = fn({
      page: 1,
      pageSize: 1,
      fieldSortingList: [
        { fieldName: 'field1', sorting: Sorting.ASC },
        { fieldName: 'field2', sorting: Sorting.DESC },
        { fieldName: 'field3', sorting: Sorting.NONE },
      ],
    })

    instance.updatePageSize(2)

    expect(instance.page).toBe(1)
    expect(instance.pageSize).toBe(2)
    expect(instance.fieldSortingList).toEqual([
      { fieldName: 'field1', sorting: Sorting.ASC },
      { fieldName: 'field2', sorting: Sorting.DESC },
      { fieldName: 'field3', sorting: Sorting.NONE },
    ])
    expect(instance.pSqlSql.orderByLimitOffset).toBe('order by field1 asc,field2 desc limit 2 offset 0')
    expect(instance.urlQueryParameters.orderBy).toBe('field1-asc,field2-desc')
    expect(instance.urlQueryParameters.page).toBe('1')
    expect(instance.urlQueryParameters.pageSize).toBe('2')
  })

  test('updateFieldSortingList', () => {
    const instance = fn({
      page: 1,
      pageSize: 1,
      fieldSortingList: [
        { fieldName: 'field1', sorting: Sorting.ASC },
        { fieldName: 'field2', sorting: Sorting.DESC },
        { fieldName: 'field3', sorting: Sorting.NONE },
      ],
    })

    instance.updateFieldSortingList([{ fieldName: 'field1', sorting: Sorting.DESC }])

    expect(instance.page).toBe(1)
    expect(instance.pageSize).toBe(1)
    expect(instance.fieldSortingList).toEqual([
      { fieldName: 'field1', sorting: Sorting.DESC },
    ])
    expect(instance.pSqlSql.orderByLimitOffset).toBe('order by field1 desc limit 1 offset 0')
    expect(instance.urlQueryParameters.orderBy).toBe('field1-desc')
    expect(instance.urlQueryParameters.page).toBe('1')
    expect(instance.urlQueryParameters.pageSize).toBe('1')
  })

  test('updateRecord', () => {
    const instance = fn({
      page: 1,
      pageSize: 1,
      fieldSortingList: [
        { fieldName: 'field1', sorting: Sorting.ASC },
        { fieldName: 'field2', sorting: Sorting.DESC },
        { fieldName: 'field3', sorting: Sorting.NONE },
      ],
    })

    instance.updateRecord({
      page: 5,
      pageSize: 10,
      fieldSortingList: [
        { fieldName: 'field2', sorting: Sorting.DESC },
      ],
    })

    expect(instance.page).toBe(5)
    expect(instance.pageSize).toBe(10)
    expect(instance.fieldSortingList).toEqual([
      { fieldName: 'field2', sorting: Sorting.DESC },
    ])
    expect(instance.pSqlSql.orderByLimitOffset).toBe('order by field2 desc limit 10 offset 40')
    expect(instance.urlQueryParameters.orderBy).toBe('field2-desc')
    expect(instance.urlQueryParameters.page).toBe('5')
    expect(instance.urlQueryParameters.pageSize).toBe('10')
  })
})

describe('createFromUrlQueryParameters', () => {
  const fn = createFromUrlQueryParameters

  test('test', () => {
    const instance = fn({
      page: '5',
      pageSize: '10',
      orderBy: 'field1-asc,field2-desc',
    })

    expect(instance.page).toBe(5)
    expect(instance.pageSize).toBe(10)
    expect(instance.fieldSortingList).toEqual([
      { fieldName: 'field1', sorting: Sorting.ASC },
      { fieldName: 'field2', sorting: Sorting.DESC },
    ])
    expect(instance.pSqlSql.orderByLimitOffset).toBe('order by field1 asc,field2 desc limit 10 offset 40')
    expect(instance.urlQueryParameters.orderBy).toBe('field1-asc,field2-desc')
    expect(instance.urlQueryParameters.page).toBe('5')
    expect(instance.urlQueryParameters.pageSize).toBe('10')
  })
})
