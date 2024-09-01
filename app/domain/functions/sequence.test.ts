import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

// Sequences produce a list of values, which means that we can't use them in a
// cell directly. Instead, we need to use them in a function that can handle a
// list of values, like SUM() or AVERAGE().

describe('DIGITS()', () => {
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIGITS(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DIGITS() does not take any arguments
      "
    `)
  })

  it('should spill all the digits', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DIGITS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
      │   │ A │ B │ C │ D │ E │ F │ G │ H │ I │ J │
      ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 1 │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
      └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
      "
    `)
  })

  it('should result in the sum of all digits', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUM(DIGITS())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┐
      │   │ A  │
      ├───┼────┤
      │ 1 │ 45 │
      └───┴────┘
      "
    `)
  })
})
