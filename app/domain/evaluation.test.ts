import { describe, expect, it } from 'vitest'
import { visualizeSpreadsheet } from '~/test/utils'
import { Spreadsheet } from './spreadsheet'

it('should evaluate a number literal', () => {
  let spreadsheet = new Spreadsheet()
  spreadsheet.set('A1', '42')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬────┐
    │   │ A  │
    ├───┼────┤
    │ 1 │ 42 │
    └───┴────┘
    "
  `)
})

it('should evaluate a number literal as expression', () => {
  let spreadsheet = new Spreadsheet()
  spreadsheet.set('A1', '=42')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬────┐
    │   │ A  │
    ├───┼────┤
    │ 1 │ 42 │
    └───┴────┘
    "
  `)
})

it('should evaluate a string literal', () => {
  let spreadsheet = new Spreadsheet()
  spreadsheet.set('A1', 'Hello World')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬─────────────┐
    │   │ A           │
    ├───┼─────────────┤
    │ 1 │ Hello World │
    └───┴─────────────┘
    "
  `)
})

it('should evaluate a string literal as expression', () => {
  let spreadsheet = new Spreadsheet()
  spreadsheet.set('A1', '="Hello World"')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───────────────┐
    │   │ A             │
    ├───┼───────────────┤
    │ 1 │ "Hello World" │
    └───┴───────────────┘
    "
  `)
})

it('should be possible to reference another cell', () => {
  let spreadsheet = new Spreadsheet()
  spreadsheet.set('A1', '=1')
  spreadsheet.set('B1', '=A1')

  expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┐
    │   │ A │ B │
    ├───┼───┼───┤
    │ 1 │ 1 │ 1 │
    └───┴───┴───┘
    "
  `)
})

describe('math operators', () => {
  it('should evaluate the `^` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '1') // Coerced to a number
    spreadsheet.set('B1', '=2') // Actually a number
    spreadsheet.set('C1', '=B1') // Reference to B1
    spreadsheet.set('A2', '=2 ^ 8')
    spreadsheet.set('B2', '=A1 ^ 2')
    spreadsheet.set('C2', '=B1 ^ C1')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────┬───┬───┐
      │   │ A   │ B │ C │
      ├───┼─────┼───┼───┤
      │ 1 │ 1   │ 2 │ 2 │
      ├───┼─────┼───┼───┤
      │ 2 │ 256 │ 1 │ 4 │
      └───┴─────┴───┴───┘
      "
    `)
  })

  it('should evaluate the `*` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '1') // Coerced to a number
    spreadsheet.set('B1', '=2') // Actually a number
    spreadsheet.set('C1', '=B1') // Reference to B1
    spreadsheet.set('A2', '=2 * A1 * B1 * C1')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┐
      │   │ A │ B │ C │
      ├───┼───┼───┼───┤
      │ 1 │ 1 │ 2 │ 2 │
      ├───┼───┼───┼───┤
      │ 2 │ 8 │   │   │
      └───┴───┴───┴───┘
      "
    `)
  })

  it('should evaluate the `/` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '1') // Coerced to a number
    spreadsheet.set('B1', '=2') // Actually a number
    spreadsheet.set('C1', '=B1') // Reference to B1
    spreadsheet.set('A2', '=100 / A1 / B1 / C1')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────┬───┬───┐
      │   │ A  │ B │ C │
      ├───┼────┼───┼───┤
      │ 1 │ 1  │ 2 │ 2 │
      ├───┼────┼───┼───┤
      │ 2 │ 25 │   │   │
      └───┴────┴───┴───┘
      "
    `)
  })

  it('should evaluate the `+` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '1') // Coerced to a number
    spreadsheet.set('B1', '=2') // Actually a number
    spreadsheet.set('C1', '=B1') // Reference to B1
    spreadsheet.set('A2', '=1 + A1 + B1 + C1')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┐
      │   │ A │ B │ C │
      ├───┼───┼───┼───┤
      │ 1 │ 1 │ 2 │ 2 │
      ├───┼───┼───┼───┤
      │ 2 │ 6 │   │   │
      └───┴───┴───┴───┘
      "
    `)
  })

  it('should evaluate the `-` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '1') // Coerced to a number
    spreadsheet.set('B1', '=2') // Actually a number
    spreadsheet.set('C1', '=B1') // Reference to B1
    spreadsheet.set('A2', '=10 - A1 - B1 - C1')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┐
      │   │ A │ B │ C │
      ├───┼───┼───┼───┤
      │ 1 │ 1 │ 2 │ 2 │
      ├───┼───┼───┼───┤
      │ 2 │ 5 │   │   │
      └───┴───┴───┴───┘
      "
    `)
  })
})

describe('comparison operators', () => {
  it('should evaluate the `==` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '1') // Coerced to a number
    spreadsheet.set('B1', '=2') // Actually a number
    spreadsheet.set('C1', '=B1') // Reference to B1
    spreadsheet.set('A2', '=1 == A1')
    spreadsheet.set('B2', '=A1 == 1')
    spreadsheet.set('C2', '=C1 == B1')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┬──────┬──────┐
      │   │ A    │ B    │ C    │
      ├───┼──────┼──────┼──────┤
      │ 1 │ 1    │ 2    │ 2    │
      ├───┼──────┼──────┼──────┤
      │ 2 │ TRUE │ TRUE │ TRUE │
      └───┴──────┴──────┴──────┘
      "
    `)
  })

  it('should evaluate the `!=` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '1') // Coerced to a number
    spreadsheet.set('B1', '=2') // Actually a number
    spreadsheet.set('C1', '=B1') // Reference to B1
    spreadsheet.set('A2', '=1 != A1')
    spreadsheet.set('B2', '=A1 != B1')
    spreadsheet.set('C2', '=B1 != C1')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┬──────┬───────┐
      │   │ A     │ B    │ C     │
      ├───┼───────┼──────┼───────┤
      │ 1 │ 1     │ 2    │ 2     │
      ├───┼───────┼──────┼───────┤
      │ 2 │ FALSE │ TRUE │ FALSE │
      └───┴───────┴──────┴───────┘
      "
    `)
  })

  it('should evaluate the `<` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=10<9')
    spreadsheet.set('B1', '=10<10')
    spreadsheet.set('C1', '=9<10')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┬───────┬──────┐
      │   │ A     │ B     │ C    │
      ├───┼───────┼───────┼──────┤
      │ 1 │ FALSE │ FALSE │ TRUE │
      └───┴───────┴───────┴──────┘
      "
    `)
  })

  it('should evaluate the `<=` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=10<=9')
    spreadsheet.set('B1', '=10<=10')
    spreadsheet.set('C1', '=9<=10')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┬──────┬──────┐
      │   │ A     │ B    │ C    │
      ├───┼───────┼──────┼──────┤
      │ 1 │ FALSE │ TRUE │ TRUE │
      └───┴───────┴──────┴──────┘
      "
    `)
  })

  it('should evaluate the `>` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=10>9')
    spreadsheet.set('B1', '=10>10')
    spreadsheet.set('C1', '=9>10')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┬───────┬───────┐
      │   │ A    │ B     │ C     │
      ├───┼──────┼───────┼───────┤
      │ 1 │ TRUE │ FALSE │ FALSE │
      └───┴──────┴───────┴───────┘
      "
    `)
  })

  it('should evaluate the `<=` operator', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=10>=9')
    spreadsheet.set('B1', '=10>=10')
    spreadsheet.set('C1', '=9>=10')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────┬──────┬───────┐
      │   │ A    │ B    │ C     │
      ├───┼──────┼──────┼───────┤
      │ 1 │ TRUE │ TRUE │ FALSE │
      └───┴──────┴──────┴───────┘
      "
    `)
  })
})
