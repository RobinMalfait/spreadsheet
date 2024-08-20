import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

beforeAll(() => {
  vi.setSystemTime(new Date(2013, 0, 21, 8, 15, 20))
})

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=JOIN()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┐
      │   │ A       │
      ├───┼─────────┤
      │ 1 │ #VALUE! │
      └───┴─────────┘

      Errors:

      · A1: JOIN() expects a string as the delimiter, got <nothing>
      "
    `)
  })

  it('should error when required argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=JOIN(1, 2, 3, 4, 5)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┐
      │   │ A       │
      ├───┼─────────┤
      │ 1 │ #VALUE! │
      └───┴─────────┘

      Errors:

      · A1: JOIN() expects a string as the delimiter, got 1
      "
    `)
  })

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOWER()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┐
      │   │ A    │
      ├───┼──────┤
      │ 1 │ #N/A │
      └───┴──────┘

      Errors:

      · A1: LOWER() expects a value as the first argument, got <nothing>
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOWER("Hello", "World")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┐
      │   │ A       │
      ├───┼─────────┤
      │ 1 │ #VALUE! │
      └───┴─────────┘

      Errors:

      · A1: LOWER() does not take more than one argument, got World
      "
    `)
  })

  it('should lowercase the argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Hello World')
    spreadsheet.set('B1', '=LOWER(A1)')
    spreadsheet.set('C1', '=LOWER(1)')
    spreadsheet.set('D1', '=LOWER("LITERAL")')
    spreadsheet.set('E1', '=LOWER(TRUE())')
    spreadsheet.set('F1', '=LOWER(TODAY())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────┬─────────────┬───┬─────────┬──────┬────────────┐
      │   │ A           │ B           │ C │ D       │ E    │ F          │
      ├───┼─────────────┼─────────────┼───┼─────────┼──────┼────────────┤
      │ 1 │ Hello World │ hello world │ 1 │ literal │ true │ 2013-01-21 │
      └───┴─────────────┴─────────────┴───┴─────────┴──────┴────────────┘
      "
    `)
  })
})

describe('UPPER()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=UPPER()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┐
      │   │ A    │
      ├───┼──────┤
      │ 1 │ #N/A │
      └───┴──────┘

      Errors:

      · A1: UPPER() expects a value as the first argument, got <nothing>
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=UPPER("Hello", "World")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┐
      │   │ A       │
      ├───┼─────────┤
      │ 1 │ #VALUE! │
      └───┴─────────┘

      Errors:

      · A1: UPPER() does not take more than one argument, got World
      "
    `)
  })

  it('should uppercase the argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Hello World')
    spreadsheet.set('B1', '=UPPER(A1)')
    spreadsheet.set('C1', '=UPPER(1)')
    spreadsheet.set('D1', '=UPPER("LITERAL")')
    spreadsheet.set('E1', '=UPPER(TRUE())')
    spreadsheet.set('F1', '=UPPER(TODAY())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────┬─────────────┬───┬─────────┬──────┬────────────┐
      │   │ A           │ B           │ C │ D       │ E    │ F          │
      ├───┼─────────────┼─────────────┼───┼─────────┼──────┼────────────┤
      │ 1 │ Hello World │ hello world │ 1 │ literal │ true │ 2013-01-21 │
      └───┴─────────────┴─────────────┴───┴─────────┴──────┴────────────┘
      "
    `)
  })
})

describe('LEN()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LEN()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┐
      │   │ A    │
      ├───┼──────┤
      │ 1 │ #N/A │
      └───┴──────┘

      Errors:

      · A1: LEN() expects a value as the first argument, got <nothing>
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LEN("Hello", "World")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┐
      │   │ A       │
      ├───┼─────────┤
      │ 1 │ #VALUE! │
      └───┴─────────┘

      Errors:

      · A1: LEN() does not take more than one argument, got World
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LEN(1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┐
      │   │ A       │
      ├───┼─────────┤
      │ 1 │ #VALUE! │
      └───┴─────────┘

      Errors:

      · A1: LEN() expects a string as the first argument, got 1
      "
    `)
  })

  it('should count the length the argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Hello')
    spreadsheet.set('B1', '=LEN(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┬───┐
      │   │ A     │ B │
      ├───┼───────┼───┤
      │ 1 │ Hello │ 5 │
      └───┴───────┴───┘
      "
    `)
  })
})
