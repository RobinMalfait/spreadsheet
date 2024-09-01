import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

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
