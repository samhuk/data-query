import { Operator } from '@samhuk/data-filter/dist/types'
import { createDataQuery } from '.'
import { SortingDirection } from './sorting/types'
import { DataQuerySql, DataQueryUrlParameters } from './types'

describe('createDataQuery', () => {
  const fn = createDataQuery

  test('basic initialization', () => {
    const instance = fn({
      page: 1,
      pageSize: 1,
      sorting: [
        { field: 'field1', sorting: SortingDirection.ASC },
        { field: 'field2', sorting: SortingDirection.DESC },
      ],
    })

    expect(instance.page).toBe(1)
    expect(instance.pageSize).toBe(1)
    expect(instance.sorting).toEqual([
      { field: 'field1', sorting: SortingDirection.ASC },
      { field: 'field2', sorting: SortingDirection.DESC },
    ])
    expect(instance.filter).toBe(undefined)
  })

  test('toSql', () => {
    // -- Arrange
    const instance = fn({
      page: 1,
      pageSize: 1,
      sorting: [
        { field: 'field1', sorting: SortingDirection.ASC },
        { field: 'field2', sorting: SortingDirection.DESC },
      ],
      filter: {
        field: 'foo',
        op: Operator.EQUALS,
        val: 1,
      },
    })

    // -- Act
    const sql = instance.toSql()

    // -- Assert
    const expected: DataQuerySql = {
      orderByLimitOffset: 'order by "field1" asc, "field2" desc limit 1 offset 0',
      where: 'where foo = 1',
    }
    expect(sql).toEqual(expected)
  })

  test('toUrlParams', () => {
    // -- Arrange
    const instance = fn({
      page: 1,
      pageSize: 1,
      sorting: [
        { field: 'field1', sorting: SortingDirection.ASC },
        { field: 'field2', sorting: SortingDirection.DESC },
      ],
      filter: {
        field: 'foo',
        op: Operator.EQUALS,
        val: 1,
      },
    })

    // -- Act
    const urlParams = instance.toUrlParams()

    // -- Assert
    const expected: DataQueryUrlParameters = {
      page: '1',
      pageSize: '1',
      sort: 'field1-asc,field2-desc',
      filter: undefined,
    }
    expect(urlParams).toEqual(expected)
  })

  test('toUrlParamsString', () => {
    // -- Arrange
    const instance = fn({
      page: 1,
      pageSize: 1,
      sorting: [
        { field: 'field1', sorting: SortingDirection.ASC },
        { field: 'field2', sorting: SortingDirection.DESC },
      ],
      filter: {
        field: 'foo',
        op: Operator.EQUALS,
        val: 1,
      },
    })

    // -- Act
    const urlParamsString = instance.toUrlParamsString()

    // -- Assert
    expect(urlParamsString).toEqual('page=1&pageSize=1&sort=field1-asc,field2-desc')
  })
})
