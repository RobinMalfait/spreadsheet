import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

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

      · A1: AS_NUMBER() expects a value as the first argument, got <nothing>
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

      · A1: AS_NUMBER() does not take more than one argument, got 456
      "
    `)
  })

  it('should convert any type to a number if possible', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Input:')
    spreadsheet.set('A2', 'Output:')

    spreadsheet.set('B1', '=123')
    spreadsheet.set('B2', '=AS_NUMBER(B1)')

    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('C2', '=AS_NUMBER(C1)')

    spreadsheet.set('D1', '=FALSE()')
    spreadsheet.set('D2', '=AS_NUMBER(D1)')

    spreadsheet.set('E1', '="123"')
    spreadsheet.set('E2', '=AS_NUMBER(E1)')

    spreadsheet.set('F1', '="invalid text"')
    spreadsheet.set('F2', '=AS_NUMBER(F1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┬─────┬──────┬───────┬─────┬──────────────┐
      │   │ A       │ B   │ C    │ D     │ E   │ F            │
      ├───┼─────────┼─────┼──────┼───────┼─────┼──────────────┤
      │ 1 │ Input:  │ 123 │ TRUE │ FALSE │ 123 │ invalid text │
      ├───┼─────────┼─────┼──────┼───────┼─────┼──────────────┤
      │ 2 │ Output: │ 123 │ 1    │ 0     │ 123 │ Error        │
      └───┴─────────┴─────┴──────┴───────┴─────┴──────────────┘

      Errors:

      · F2: AS_NUMBER() expects a number, got invalid text
      "
    `)
  })
})
