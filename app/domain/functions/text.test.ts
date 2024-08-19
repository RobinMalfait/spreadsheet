import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

describe('CONCAT()', () => {
  it('should concat all arguments together', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '="Hello"')
    spreadsheet.set('B1', '="World"')
    spreadsheet.set('C1', '=CONCAT(A1, " ", B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┬───────┬─────────────┐
      │   │ A     │ B     │ C           │
      ├───┼───────┼───────┼─────────────┤
      │ 1 │ Hello │ World │ Hello World │
      └───┴───────┴───────┴─────────────┘
      "
    `)
  })
})

describe('JOIN()', () => {
  it('should join all arguments with the first argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '="Tic"')
    spreadsheet.set('B1', '="Tac"')
    spreadsheet.set('C1', '="Toe"')
    spreadsheet.set('D1', '=JOIN("–", A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┬─────┬─────┬─────────────┐
      │   │ A   │ B   │ C   │ D           │
      ├───┼─────┼─────┼─────┼─────────────┤
      │ 1 │ Tic │ Tac │ Toe │ Tic–Tac–Toe │
      └───┴─────┴─────┴─────┴─────────────┘
      "
    `)
  })
})

describe('LOWER()', () => {
  it('should lowercase all arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Hello World')
    spreadsheet.set('B1', '=LOWER(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────┬─────────────┐
      │   │ A           │ B           │
      ├───┼─────────────┼─────────────┤
      │ 1 │ Hello World │ hello world │
      └───┴─────────────┴─────────────┘
      "
    `)
  })
})

describe('UPPER()', () => {
  it('should uppercase all arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Hello World')
    spreadsheet.set('B1', '=UPPER(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────┬─────────────┐
      │   │ A           │ B           │
      ├───┼─────────────┼─────────────┤
      │ 1 │ Hello World │ HELLO WORLD │
      └───┴─────────────┴─────────────┘
      "
    `)
  })
})
