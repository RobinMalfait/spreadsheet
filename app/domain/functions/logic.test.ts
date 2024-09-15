import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'
import { exampleTests } from '~/test/utils'
import * as functions from './logic'
await exampleTests(functions)

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

      · A1: TRUE() does not take any arguments
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

      · A1: FALSE() does not take any arguments
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

      · A1: IF(test: BOOLEAN, consequent: T, alternate: T) Argument \`test\` received a \`STRING\`
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

      · A1: IF(test: BOOLEAN, consequent: T, alternate: T) takes at most 3 arguments, got 4
      "
    `)
  })

  it('should result in the consequent when the test is truthy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=5')
    spreadsheet.set('B1', '=IF(A1 == 5, "Five!", "Not five!")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬─────────┐
      │   │ A │ B       │
      ├───┼───┼─────────┤
      │ 1 │ 5 │ "Five!" │
      └───┴───┴─────────┘
      "
    `)
  })

  it('should result in the alternate when the test is falsy', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=IF(A1 == 5, "Five!", "Not five!")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬─────────────┐
      │   │ A │ B           │
      ├───┼───┼─────────────┤
      │ 1 │ 2 │ "Not five!" │
      └───┴───┴─────────────┘
      "
    `)
  })
})

describe('IF()', () => {
  it('should error when no value is provided', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SWITCH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SWITCH(value: T, ...cases: T, default?: T) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when no cases are provided', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SWITCH(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SWITCH(value: T, ...cases: T, default?: T) Argument \`cases\` was not provided
      "
    `)
  })

  it('should error when no case matches and no default was provided', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SWITCH("ABC", "FOO", 1, "BAR", 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SWITCH(ABC) No matching case found
      "
    `)
  })

  it('should find the matching case, and return its value', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SWITCH(2, 1, "One", 2, "Two", 3, "Three")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ "Two" │
      └───┴───────┘
      "
    `)
  })

  it('should result in the default value when no match is found', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SWITCH(8, 1, "One", 2, "Two", 3, "Three", "Other")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┐
      │   │ A       │
      ├───┼─────────┤
      │ 1 │ "Other" │
      └───┴─────────┘
      "
    `)
  })
})

describe('IF_ERROR()', () => {
  it('should error when the value is not provided at all', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IF_ERROR()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IF_ERROR(value: T, fallback: T) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when the fallback is not provided', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IF_ERROR(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: IF_ERROR(value: T, fallback: T) Argument \`fallback\` was not provided
      "
    `)
  })

  it('should result in the value itself if it is not an error', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IF_ERROR("Not an error", "Fallback")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────────┐
      │   │ A              │
      ├───┼────────────────┤
      │ 1 │ "Not an error" │
      └───┴────────────────┘
      "
    `)
  })

  it('should result in the fallback if the value is an error', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=IF_ERROR(123 / 0, "Fallback")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────┐
      │   │ A          │
      ├───┼────────────┤
      │ 1 │ "Fallback" │
      └───┴────────────┘
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

      · A1: NOT(value: BOOLEAN) Argument \`value\` received a \`STRING\`
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

      · A1: NOT(value: BOOLEAN) takes at most 1 argument, got 2
      "
    `)
  })

  it('should result in FALSE when the argument is TRUE', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=1')
    spreadsheet.set('B1', '=NOT(AS_BOOLEAN(A1))')

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
    spreadsheet.set('B1', '=NOT(AS_BOOLEAN(A1))')

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
