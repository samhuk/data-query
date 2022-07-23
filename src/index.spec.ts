import { Operator } from '@samhuk/data-filter/dist/types'
import { createDataQuery } from '.'
import { SortingDirection } from './sorting/types'
import { DataQuerySql, DataQueryUrlParameters } from './types'

describe('index', () => {
  describe('createDataQuery', () => {
    const fn = createDataQuery

    test('basic initialization', () => {
      // -- Arrange + Act
      const instance = fn({
        page: 1,
        pageSize: 1,
        sorting: [
          { field: 'field1', dir: SortingDirection.ASC },
          { field: 'field2', dir: SortingDirection.DESC },
        ],
      })

      // -- Assert
      expect(instance.page).toBe(1)
      expect(instance.pageSize).toBe(1)
      expect(instance.sorting).toEqual([
        { field: 'field1', dir: SortingDirection.ASC },
        { field: 'field2', dir: SortingDirection.DESC },
      ])
      expect(instance.filter).toBe(undefined)
    })

    test('toSql', () => {
      // -- Arrange
      const instance = fn({
        page: 1,
        pageSize: 1,
        sorting: [
          { field: 'field1', dir: SortingDirection.ASC },
          { field: 'field2', dir: SortingDirection.DESC },
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
        orderByLimitOffsetWhere: 'order by "field1" asc, "field2" desc limit 1 offset 0 where foo = 1',
      }
      expect(sql).toEqual(expected)
    })

    test('toUrlParams', () => {
      // -- Arrange
      const instance = fn({
        page: 1,
        pageSize: 1,
        sorting: [
          { field: 'field1', dir: SortingDirection.ASC },
          { field: 'field2', dir: SortingDirection.DESC },
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
        filter: '%7B%22field%22:%22foo%22,%22op%22:%22=%22,%22val%22:1%7D',
      }
      expect(urlParams).toEqual(expected)
    })

    test('toUrlParamsString', () => {
      // -- Arrange
      const instance = fn({
        page: 1,
        pageSize: 1,
        sorting: [
          { field: 'field1', dir: SortingDirection.ASC },
          { field: 'field2', dir: SortingDirection.DESC },
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
      expect(urlParamsString).toEqual('page=1&pageSize=1&sort=field1-asc,field2-desc&filter=%7B%22field%22:%22foo%22,%22op%22:%22=%22,%22val%22:1%7D')
    })

    test('fromUrlParams', () => {
      // -- Arrange
      const urlParams: DataQueryUrlParameters = {
        page: '1',
        pageSize: '1',
        sort: 'field1-asc,field2-desc',
        filter: '%7B%22field%22:%22foo%22,%22op%22:%22=%22,%22val%22:1%7D',
      }

      // -- Act
      const dataQuery = createDataQuery().fromUrlParams(urlParams)

      // -- Assert
      expect(dataQuery.page).toBe(1)
      expect(dataQuery.pageSize).toBe(1)
      expect(dataQuery.sorting).toEqual([
        { field: 'field1', dir: SortingDirection.ASC },
        { field: 'field2', dir: SortingDirection.DESC },
      ])
      expect(dataQuery.filter).toEqual({
        field: 'foo',
        op: Operator.EQUALS,
        val: 1,
      })
    })
  })
})
