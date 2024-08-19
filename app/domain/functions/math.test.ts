import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

describe('PI()', () => {
  it('should result in the value of PI', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ 3.141592653589793 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('TAU()', () => {
  it('should result in the value of TAU', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TAU()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┐
      │   │ A                 │
      ├───┼───────────────────┤
      │ 1 │ 6.283185307179586 │
      └───┴───────────────────┘
      "
    `)
  })
})

describe('SUM()', () => {
  it('should sum up all the numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=4')
    spreadsheet.set('C1', '=6')
    spreadsheet.set('A2', '=SUM(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┬───┐
      │   │ A  │ B │ C │
      ├───┼────┼───┼───┤
      │ 1 │ 2  │ 4 │ 6 │
      ├───┼────┼───┼───┤
      │ 2 │ 12 │   │   │
      └───┴────┴───┴───┘
      "
    `)
  })
})

describe('SUBTRACT()', () => {
  it('should subtract all the numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=12')
    spreadsheet.set('B1', '=6')
    spreadsheet.set('C1', '=3')
    spreadsheet.set('A2', '=SUBTRACT(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┬───┐
      │   │ A  │ B │ C │
      ├───┼────┼───┼───┤
      │ 1 │ 12 │ 6 │ 3 │
      ├───┼────┼───┼───┤
      │ 2 │ 3  │   │   │
      └───┴────┴───┴───┘
      "
    `)
  })
})

describe('MULTIPLY()', () => {
  it('should multiply two numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('A2', '=PRODUCT(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┐
      │   │ A │ B │
      ├───┼───┼───┤
      │ 1 │ 2 │ 3 │
      ├───┼───┼───┤
      │ 2 │ 6 │   │
      └───┴───┴───┘
      "
    `)
  })
})

describe('PRODUCT()', () => {
  it('should multiply all the numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=4')
    spreadsheet.set('A2', '=PRODUCT(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┬───┐
      │   │ A  │ B │ C │
      ├───┼────┼───┼───┤
      │ 1 │ 2  │ 3 │ 4 │
      ├───┼────┼───┼───┤
      │ 2 │ 24 │   │   │
      └───┴────┴───┴───┘
      "
    `)
  })
})

describe('DIVIDE()', () => {
  it('should divide two numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=12')
    spreadsheet.set('B1', '=2')
    spreadsheet.set('A2', '=DIVIDE(A1:B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┐
      │   │ A  │ B │
      ├───┼────┼───┤
      │ 1 │ 12 │ 2 │
      ├───┼────┼───┤
      │ 2 │ 6  │   │
      └───┴────┴───┘
      "
    `)
  })
})

describe('POWER()', () => {
  it('should calculate the power of a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=12')
    spreadsheet.set('B1', '=2')
    spreadsheet.set('A2', '=POWER(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┬───┐
      │   │ A   │ B │
      ├───┼─────┼───┤
      │ 1 │ 12  │ 2 │
      ├───┼─────┼───┤
      │ 2 │ 144 │   │
      └───┴─────┴───┘
      "
    `)
  })
})

describe('AVERAGE()', () => {
  it('should calculate the average of a set of numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=4')
    spreadsheet.set('A2', '=AVERAGE(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┐
      │   │ A │ B │ C │
      ├───┼───┼───┼───┤
      │ 1 │ 2 │ 3 │ 4 │
      ├───┼───┼───┼───┤
      │ 2 │ 3 │   │   │
      └───┴───┴───┴───┘
      "
    `)
  })
})

describe('MOD()', () => {
  it('should compute the modulo', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=13')
    spreadsheet.set('B1', '=10')
    spreadsheet.set('A2', '=MOD(A1, B1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬────┐
      │   │ A  │ B  │
      ├───┼────┼────┤
      │ 1 │ 13 │ 10 │
      ├───┼────┼────┤
      │ 2 │ 3  │    │
      └───┴────┴────┘
      "
    `)
  })
})

describe('FLOOR()', () => {
  it('should floor a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=FLOOR(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬───┐
      │   │ A                 │ B │
      ├───┼───────────────────┼───┤
      │ 1 │ 3.141592653589793 │ 3 │
      └───┴───────────────────┴───┘
      "
    `)
  })
})

describe('CEIL()', () => {
  it('should ceil a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=CEIL(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬───┐
      │   │ A                 │ B │
      ├───┼───────────────────┼───┤
      │ 1 │ 3.141592653589793 │ 4 │
      └───┴───────────────────┴───┘
      "
    `)
  })
})

describe('ROUND()', () => {
  it('should round a number', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=ROUND(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬───┐
      │   │ A                 │ B │
      ├───┼───────────────────┼───┤
      │ 1 │ 3.141592653589793 │ 3 │
      └───┴───────────────────┴───┘
      "
    `)
  })

  it('should round a number with 1 decimal of precision', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=ROUND(A1, 1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬─────┐
      │   │ A                 │ B   │
      ├───┼───────────────────┼─────┤
      │ 1 │ 3.141592653589793 │ 3.1 │
      └───┴───────────────────┴─────┘
      "
    `)
  })

  it('should round a number with 2 decimals of precision', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=PI()')
    spreadsheet.set('B1', '=ROUND(A1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────────────────┬──────┐
      │   │ A                 │ B    │
      ├───┼───────────────────┼──────┤
      │ 1 │ 3.141592653589793 │ 3.14 │
      └───┴───────────────────┴──────┘
      "
    `)
  })
})
