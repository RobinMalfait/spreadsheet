import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

describe('INHERIT_FORMULA()', () => {
  it('should error when the passed argument is missing', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=INHERIT_FORMULA()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: Expected a cell reference
      "
    `)
  })

  it('should error when cell is referencing itself', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=INHERIT_FORMULA(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: Circular reference detected in cell A1
      "
    `)
  })

  it('should error when the referenced cell, references the current cell', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=INHERIT_FORMULA(A2)')
    spreadsheet.set('A2', '=INHERIT_FORMULA(A3)')
    spreadsheet.set('A3', '=INHERIT_FORMULA(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      ├───┼───────┤
      │ 2 │ Error │
      ├───┼───────┤
      │ 3 │ Error │
      └───┴───────┘

      Errors:

      · A1: Circular reference detected in cell A3
      · A2: Circular reference detected in cell A1
      · A3: Circular reference detected in cell A2
      "
    `)
  })

  it('should inherit a formula of a different cell', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1 + 2')
    spreadsheet.set('A2', '=INHERIT_FORMULA(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 3 │
      ├───┼───┤
      │ 2 │ 3 │
      └───┴───┘
      "
    `)
  })

  it('should update cell reference to be relative to the current cell', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('A2', '=3')
    spreadsheet.set('A3', '=4')
    spreadsheet.set('B1', '=A1 * 2')
    spreadsheet.set('B2:B3', '=INHERIT_FORMULA(B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┐
      │   │ A │ B │
      ├───┼───┼───┤
      │ 1 │ 2 │ 4 │
      ├───┼───┼───┤
      │ 2 │ 3 │ 6 │
      ├───┼───┼───┤
      │ 3 │ 4 │ 8 │
      └───┴───┴───┘
      "
    `)
  })

  it('should proxy formulas when inheriting a formula from an inherited formula', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('A2', '=3')
    spreadsheet.set('A3', '=4')
    spreadsheet.set('B1', '=A1 * 2')
    spreadsheet.set('B2', '=INHERIT_FORMULA(B1)')
    spreadsheet.set('B3', '=INHERIT_FORMULA(B2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┐
      │   │ A │ B │
      ├───┼───┼───┤
      │ 1 │ 2 │ 4 │
      ├───┼───┼───┤
      │ 2 │ 3 │ 6 │
      ├───┼───┼───┤
      │ 3 │ 4 │ 8 │
      └───┴───┴───┘
      "
    `)
  })
})

describe('COL()', () => {
  it('should calculate the current column number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('B2', '=COL()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 2 │
      └───┴───┘
      "
    `)
  })

  it('should calculate the column number of the given cell', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=COL(C2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 3 │
      └───┴───┘
      "
    `)
  })
})

describe('ROW()', () => {
  it('should calculate the current row number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('B2', '=ROW()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 2 │
      └───┴───┘
      "
    `)
  })

  it('should calculate the row number of the given cell', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ROW(C2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 2 │
      └───┴───┘
      "
    `)
  })
})
