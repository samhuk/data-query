import { DataFilterLogic, Operator } from '@samhuk/data-filter/dist/types'
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

    describe('toSql', () => {
      test('basic test - inlineValues = true', () => {
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
        const sql = instance.toSql({ inlineValues: true })

        // -- Assert
        const expected: DataQuerySql = {
          orderByLimitOffset: 'order by "field1" asc, "field2" desc limit 1 offset 0',
          where: 'where foo = 1',
          whereOrderByLimitOffset: 'where foo = 1 order by "field1" asc, "field2" desc limit 1 offset 0',
        }
        expect(sql).toEqual(expected)
      })

      test('basic test - inlineValues = false', () => {
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
        const sql = instance.toSql({ inlineValues: false })

        // -- Assert
        const expected: DataQuerySql = {
          orderByLimitOffset: 'order by "field1" asc, "field2" desc limit 1 offset 0',
          where: 'where foo = $1',
          whereOrderByLimitOffset: 'where foo = $1 order by "field1" asc, "field2" desc limit 1 offset 0',
          values: [1],
        }
        expect(sql).toEqual(expected)
      })
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

    test('field name types', () => {
      // -- Arrange + Act
      const instance = fn<'id'|'uuid'|'name'|'dateDeleted'>({
        page: 1,
        pageSize: 1,
        sorting: [
          { field: 'id', dir: SortingDirection.ASC },
          // @ts-expect-error
          { field: 'notAField', dir: SortingDirection.DESC },
        ],
        filter: {
          logic: DataFilterLogic.AND,
          nodes: [
            { field: 'id', op: Operator.EQUALS, val: 5 },
            // @ts-expect-error
            { field: 'notAField', op: Operator.EQUALS, val: 5 },
          ],
        },
      })

      // Dummy assertion
      expect(instance).toBeDefined()
    })

    test('transformers', () => {
      // -- Arrange + Act
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

      const sql = instance.toSql({
        filterTransformer: node => ({ left: `prefix.${node.field}` }),
        sortingTransformer: node => ({ left: `prefix.${node.field}` }),
      })

      const expected: DataQuerySql = {
        orderByLimitOffset: 'order by prefix.field1 asc, prefix.field2 desc limit 1 offset 0',
        where: 'where prefix.foo = $1',
        whereOrderByLimitOffset: 'where prefix.foo = $1 order by prefix.field1 asc, prefix.field2 desc limit 1 offset 0',
        values: [1],
      }
      expect(sql).toEqual(expected)
    })

    describe('unhappy paths', () => {
      test('no options provided', () => {
        // -- Arrange + Act
        const instance = fn()

        const sql = instance.toSql()

        const expected: DataQuerySql = {
          orderByLimitOffset: null,
          where: null,
          whereOrderByLimitOffset: null,
          values: [],
        }
        expect(sql).toEqual(expected)
      })

      test('empty options object provided', () => {
        // -- Arrange + Act
        const instance = fn({ })

        const sql = instance.toSql()

        const expected: DataQuerySql = {
          orderByLimitOffset: null,
          where: null,
          whereOrderByLimitOffset: null,
          values: [],
        }
        expect(sql).toEqual(expected)
      })

      test('no paging provided', () => {
        // -- Arrange + Act
        const instance = fn({ filter: { field: 'foo', op: Operator.EQUALS, val: 1 } })

        const sql = instance.toSql()

        const expected: DataQuerySql = {
          orderByLimitOffset: null,
          where: 'where foo = $1',
          whereOrderByLimitOffset: 'where foo = $1',
          values: [1],
        }
        expect(sql).toEqual(expected)
      })

      test('no filter provided', () => {
        // -- Arrange + Act
        const instance = fn({ page: 3, pageSize: 50 })

        const sql = instance.toSql()

        const expected: DataQuerySql = {
          orderByLimitOffset: 'limit 50 offset 100',
          where: null,
          whereOrderByLimitOffset: 'limit 50 offset 100',
          values: [],
        }
        expect(sql).toEqual(expected)
      })
    })
  })
})
