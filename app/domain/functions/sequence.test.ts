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

describe('TRANSPOSE()', () => {
  it('should transpose a matrix', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '↘')
    spreadsheet.set('B1', '=DIGITS()')
    spreadsheet.set('A2', '=TRANSPOSE(DIGITS())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌────┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
      │    │ A │ B │ C │ D │ E │ F │ G │ H │ I │ J │ K │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 1  │ ↘ │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 2  │ 0 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 3  │ 1 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 4  │ 2 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 5  │ 3 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 6  │ 4 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 7  │ 5 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 8  │ 6 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 9  │ 7 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 10 │ 8 │   │   │   │   │   │   │   │   │   │   │
      ├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
      │ 11 │ 9 │   │   │   │   │   │   │   │   │   │   │
      └────┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
      "
    `)
  })
})

describe('MATRIX()', () => {
  it('should create a MATRIX() with a given value', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MATRIX(4, 5, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┬───┬───┐
      │   │ A │ B │ C │ D │ E │
      ├───┼───┼───┼───┼───┼───┤
      │ 1 │ 3 │ 3 │ 3 │ 3 │ 3 │
      ├───┼───┼───┼───┼───┼───┤
      │ 2 │ 3 │ 3 │ 3 │ 3 │ 3 │
      ├───┼───┼───┼───┼───┼───┤
      │ 3 │ 3 │ 3 │ 3 │ 3 │ 3 │
      ├───┼───┼───┼───┼───┼───┤
      │ 4 │ 3 │ 3 │ 3 │ 3 │ 3 │
      └───┴───┴───┴───┴───┴───┘
      "
    `)
  })
})
