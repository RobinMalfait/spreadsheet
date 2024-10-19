import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'
import { exampleTests } from '~/test/utils'
import * as functions from './types'
await exampleTests(functions)

beforeAll(() => {
  vi.setSystemTime(new Date(2013, 0, 21, 8, 15, 20))
})

describe('AS_NUMBER()', () => {
  it('should error when the argument is not provided', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=AS_NUMBER()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: AS_NUMBER(value: T) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when providing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=AS_NUMBER(123, 456)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: AS_NUMBER(value: T) takes at most 1 argument, got 2
      "
    `)
  })

  it('should convert any type to a number if possible', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Input:')
    spreadsheet.set('A2', 'Output:')
    spreadsheet.set('A3', 'Type:')

    spreadsheet.set('B1', '=123')
    spreadsheet.set('B2', '=AS_NUMBER(B1)')
    spreadsheet.set('B3', '=TYPE(B2)')

    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('C2', '=AS_NUMBER(C1)')
    spreadsheet.set('C3', '=TYPE(C2)')

    spreadsheet.set('D1', '=FALSE()')
    spreadsheet.set('D2', '=AS_NUMBER(D1)')
    spreadsheet.set('D3', '=TYPE(D2)')

    spreadsheet.set('E1', '="123"')
    spreadsheet.set('E2', '=AS_NUMBER(E1)')
    spreadsheet.set('E3', '=TYPE(E2)')

    spreadsheet.set('F1', '="invalid text"')
    spreadsheet.set('F2', '=AS_NUMBER(F1)')
    spreadsheet.set('F3', '=TYPE(F2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┬──────────┬──────────┬──────────┬──────────┬────────────────┐
      │   │ A       │ B        │ C        │ D        │ E        │ F              │
      ├───┼─────────┼──────────┼──────────┼──────────┼──────────┼────────────────┤
      │ 1 │ Input:  │ 123      │ TRUE     │ FALSE    │ "123"    │ "invalid text" │
      ├───┼─────────┼──────────┼──────────┼──────────┼──────────┼────────────────┤
      │ 2 │ Output: │ 123      │ 1        │ 0        │ 123      │ Error          │
      ├───┼─────────┼──────────┼──────────┼──────────┼──────────┼────────────────┤
      │ 3 │ Type:   │ "number" │ "number" │ "number" │ "number" │ "error"        │
      └───┴─────────┴──────────┴──────────┴──────────┴──────────┴────────────────┘

      Errors:

      · F2: AS_NUMBER() expects a number, got invalid text
      "
    `)
  })
})

describe('AS_STRING()', () => {
  it('should error when the argument is not provided', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=AS_STRING()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: AS_STRING(value: T) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when providing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=AS_STRING(123, 456)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: AS_STRING(value: T) takes at most 1 argument, got 2
      "
    `)
  })

  it('should convert any type to a string if possible', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Input:')
    spreadsheet.set('A2', 'Output:')
    spreadsheet.set('A3', 'Type:')

    spreadsheet.set('B1', '=123')
    spreadsheet.set('B2', '=AS_STRING(B1)')
    spreadsheet.set('B3', '=TYPE(B2)')

    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('C2', '=AS_STRING(C1)')
    spreadsheet.set('C3', '=TYPE(C2)')

    spreadsheet.set('D1', '=FALSE()')
    spreadsheet.set('D2', '=AS_STRING(D1)')
    spreadsheet.set('D3', '=TYPE(D2)')

    spreadsheet.set('E1', '="hello world"')
    spreadsheet.set('E2', '=AS_STRING(E1)')
    spreadsheet.set('E3', '=TYPE(E2)')

    spreadsheet.set('F1', '=NOW()')
    spreadsheet.set('F2', '=AS_STRING(F1)')
    spreadsheet.set('F3', '=TYPE(F2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┬──────────┬──────────┬──────────┬───────────────┬───────────────────────┐
      │   │ A       │ B        │ C        │ D        │ E             │ F                     │
      ├───┼─────────┼──────────┼──────────┼──────────┼───────────────┼───────────────────────┤
      │ 1 │ Input:  │ 123      │ TRUE     │ FALSE    │ "hello world" │ 2013-01-21 08:15:20   │
      ├───┼─────────┼──────────┼──────────┼──────────┼───────────────┼───────────────────────┤
      │ 2 │ Output: │ "123"    │ "TRUE"   │ "FALSE"  │ "hello world" │ "2013-01-21 08:15:20" │
      ├───┼─────────┼──────────┼──────────┼──────────┼───────────────┼───────────────────────┤
      │ 3 │ Type:   │ "string" │ "string" │ "string" │ "string"      │ "string"              │
      └───┴─────────┴──────────┴──────────┴──────────┴───────────────┴───────────────────────┘
      "
    `)
  })
})

describe('AS_BOOLEAN()', () => {
  it('should error when the argument is not provided', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=AS_BOOLEAN()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: AS_BOOLEAN(value: T) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when providing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=AS_BOOLEAN(123, 456)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: AS_BOOLEAN(value: T) takes at most 1 argument, got 2
      "
    `)
  })

  it('should convert any type to a string if possible', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Input:')
    spreadsheet.set('A2', 'Output:')
    spreadsheet.set('A3', 'Type:')

    spreadsheet.set('B1', '=123')
    spreadsheet.set('B2', '=AS_BOOLEAN(B1)')
    spreadsheet.set('B3', '=TYPE(B2)')

    spreadsheet.set('C1', '=0')
    spreadsheet.set('C2', '=AS_BOOLEAN(C1)')
    spreadsheet.set('C3', '=TYPE(C2)')

    spreadsheet.set('D1', '=TRUE()')
    spreadsheet.set('D2', '=AS_BOOLEAN(D1)')
    spreadsheet.set('D3', '=TYPE(D2)')

    spreadsheet.set('E1', '=FALSE()')
    spreadsheet.set('E2', '=AS_BOOLEAN(E1)')
    spreadsheet.set('E3', '=TYPE(E2)')

    spreadsheet.set('F1', '=""')
    spreadsheet.set('F2', '=AS_BOOLEAN(F1)')
    spreadsheet.set('F3', '=TYPE(F2)')

    spreadsheet.set('G1', '="hello world"')
    spreadsheet.set('G2', '=AS_BOOLEAN(G1)')
    spreadsheet.set('G3', '=TYPE(G2)')

    spreadsheet.set('H1', '=NOW()')
    spreadsheet.set('H2', '=AS_BOOLEAN(H1)')
    spreadsheet.set('H3', '=TYPE(H2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┬───────────┬───────────┬───────────┬───────────┬───────────┬───────────────┬─────────────────────┐
      │   │ A       │ B         │ C         │ D         │ E         │ F         │ G             │ H                   │
      ├───┼─────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────────┼─────────────────────┤
      │ 1 │ Input:  │ 123       │ 0         │ TRUE      │ FALSE     │ ""        │ "hello world" │ 2013-01-21 08:15:20 │
      ├───┼─────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────────┼─────────────────────┤
      │ 2 │ Output: │ TRUE      │ FALSE     │ TRUE      │ FALSE     │ FALSE     │ TRUE          │ TRUE                │
      ├───┼─────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────────┼─────────────────────┤
      │ 3 │ Type:   │ "boolean" │ "boolean" │ "boolean" │ "boolean" │ "boolean" │ "boolean"     │ "boolean"           │
      └───┴─────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────────┴─────────────────────┘
      "
    `)
  })
})
