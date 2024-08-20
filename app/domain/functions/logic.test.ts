import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

describe('TRUE()', () => {
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRUE(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TRUE() does not take an argument, got 123
      "
    `)
  })

  it('should result in TRUE', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRUE()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┐
      │   │ A    │
      ├───┼──────┤
      │ 1 │ TRUE │
      └───┴──────┘
      "
    `)
  })
})

describe('FALSE()', () => {
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FALSE(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FALSE() does not take an argument, got 123
      "
    `)
  })

  it('should result in FALSE', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FALSE()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ FALSE │
      └───┴───────┘
      "
    `)
  })
})

describe('IF()', () => {
  it('should error when the test is a literal string', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IF("UH OH", 1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IF() expects a boolean as the first argument, got UH OH
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IF(TRUE(), 1, 2, 3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IF() does not take more than three arguments, got 3
      "
    `)
  })

  it('should result in the consequent when the test is truthy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=5')
    spreadsheet.set('B1', '=IF(A1 == 5, "Five!", "Not five!")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───────┐
      │   │ A │ B     │
      ├───┼───┼───────┤
      │ 1 │ 5 │ Five! │
      └───┴───┴───────┘
      "
    `)
  })

  it('should result in the alternate when the test is falsy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=IF(A1 == 5, "Five!", "Not five!")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───────────┐
      │   │ A │ B         │
      ├───┼───┼───────────┤
      │ 1 │ 2 │ Not five! │
      └───┴───┴───────────┘
      "
    `)
  })
})

describe('AND()', () => {
  it('should result in TRUE when all arguments are truthy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('B1', '=2')
    spreadsheet.set('C1', '=3')
    spreadsheet.set('A2', '=AND(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┬───┬───┐
      │   │ A    │ B │ C │
      ├───┼──────┼───┼───┤
      │ 1 │ 1    │ 2 │ 3 │
      ├───┼──────┼───┼───┤
      │ 2 │ TRUE │   │   │
      └───┴──────┴───┴───┘
      "
    `)
  })

  it('should result in FALSE when not all arguments are truthy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('B1', '=0')
    spreadsheet.set('C1', '=3')
    spreadsheet.set('A2', '=AND(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┬───┬───┐
      │   │ A     │ B │ C │
      ├───┼───────┼───┼───┤
      │ 1 │ 1     │ 0 │ 3 │
      ├───┼───────┼───┼───┤
      │ 2 │ FALSE │   │   │
      └───┴───────┴───┴───┘
      "
    `)
  })
})

describe('OR()', () => {
  it('should result in TRUE when some arguments are truthy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('B1', '=0')
    spreadsheet.set('C1', '=0')
    spreadsheet.set('A2', '=OR(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┬───┬───┐
      │   │ A    │ B │ C │
      ├───┼──────┼───┼───┤
      │ 1 │ 1    │ 0 │ 0 │
      ├───┼──────┼───┼───┤
      │ 2 │ TRUE │   │   │
      └───┴──────┴───┴───┘
      "
    `)
  })

  it('should result in FALSE when no arguments are truthy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=0')
    spreadsheet.set('B1', '=0')
    spreadsheet.set('C1', '=0')
    spreadsheet.set('A2', '=OR(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┬───┬───┐
      │   │ A     │ B │ C │
      ├───┼───────┼───┼───┤
      │ 1 │ 0     │ 0 │ 0 │
      ├───┼───────┼───┼───┤
      │ 2 │ FALSE │   │   │
      └───┴───────┴───┴───┘
      "
    `)
  })
})

describe('NOT()', () => {
  it('should error when the test is a literal string', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOT("UH OH")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: NOT() expects a boolean as the first argument, got UH OH
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOT(TRUE(), 1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: NOT() does not take a second argument, got 1
      "
    `)
  })

  it('should result in FALSE when the argument is truthy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('B1', '=NOT(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───────┐
      │   │ A │ B     │
      ├───┼───┼───────┤
      │ 1 │ 1 │ FALSE │
      └───┴───┴───────┘
      "
    `)
  })

  it('should result in TRUE when the argument is falsy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=0')
    spreadsheet.set('B1', '=NOT(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬──────┐
      │   │ A │ B    │
      ├───┼───┼──────┤
      │ 1 │ 0 │ TRUE │
      └───┴───┴──────┘
      "
    `)
  })
})
