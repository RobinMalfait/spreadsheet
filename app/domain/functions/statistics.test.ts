import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'
import { exampleTests } from '~/test/utils'
import * as functions from './statistics'
await exampleTests(functions)

beforeAll(() => {
  vi.setSystemTime(new Date(2013, 0, 21, 8, 15, 20))
})

describe('COUNT()', () => {
  it('should count all numbers in a set of arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=4')
    spreadsheet.set('D1', '="string"')
    spreadsheet.set('E1', '=TRUE()')
    // Explicitly ignored F1
    spreadsheet.set('G1', '=NOW()')
    spreadsheet.set('A2', '=COUNT(A1:G1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┬──────────┬──────┬───┬─────────────────────┐
      │   │ A │ B │ C │ D        │ E    │ F │ G                   │
      ├───┼───┼───┼───┼──────────┼──────┼───┼─────────────────────┤
      │ 1 │ 2 │ 3 │ 4 │ "string" │ TRUE │   │ 2013-01-21 08:15:20 │
      ├───┼───┼───┼───┼──────────┼──────┼───┼─────────────────────┤
      │ 2 │ 3 │   │   │          │      │   │                     │
      └───┴───┴───┴───┴──────────┴──────┴───┴─────────────────────┘
      "
    `)
  })
})

describe('MIN()', () => {
  it('should compute the minimum of a set of numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=4')
    spreadsheet.set('A2', '=MIN(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┐
      │   │ A │ B │ C │
      ├───┼───┼───┼───┤
      │ 1 │ 2 │ 3 │ 4 │
      ├───┼───┼───┼───┤
      │ 2 │ 2 │   │   │
      └───┴───┴───┴───┘
      "
    `)
  })

  it('should ignore non-number types', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('A2', '=MIN(A1:C1, 4, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬──────┐
      │   │ A │ B │ C    │
      ├───┼───┼───┼──────┤
      │ 1 │ 2 │ 3 │ TRUE │
      ├───┼───┼───┼──────┤
      │ 2 │ 2 │   │      │
      └───┴───┴───┴──────┘
      "
    `)
  })
})

describe('MAX()', () => {
  it('should compute the minimum of a set of numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=4')
    spreadsheet.set('A2', '=MAX(A1:C1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬───┐
      │   │ A │ B │ C │
      ├───┼───┼───┼───┤
      │ 1 │ 2 │ 3 │ 4 │
      ├───┼───┼───┼───┤
      │ 2 │ 4 │   │   │
      └───┴───┴───┴───┘
      "
    `)
  })

  it('should ignore non-number types', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('A2', '=MAX(A1:C1, 4, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬──────┐
      │   │ A │ B │ C    │
      ├───┼───┼───┼──────┤
      │ 1 │ 2 │ 3 │ TRUE │
      ├───┼───┼───┼──────┤
      │ 2 │ 4 │   │      │
      └───┴───┴───┴──────┘
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

  it('should ignore non-number types', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=2')
    spreadsheet.set('B1', '=3')
    spreadsheet.set('C1', '=TRUE()')
    spreadsheet.set('A2', '=AVERAGE(A1:C1, 4, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┬───┬──────┐
      │   │ A │ B │ C    │
      ├───┼───┼───┼──────┤
      │ 1 │ 2 │ 3 │ TRUE │
      ├───┼───┼───┼──────┤
      │ 2 │ 3 │   │      │
      └───┴───┴───┴──────┘
      "
    `)
  })
})

describe('MEDIAN()', () => {
  it('should calculate the median of a set of numbers (even amount)', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MEDIAN(2, 3, 3, 5, 7, 10)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 4 │
      └───┴───┘
      "
    `)
  })

  it('should calculate the median of a set of numbers (odd amount)', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MEDIAN(2, 3, 5, 7, 10)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───┐
      │   │ A │
      ├───┼───┤
      │ 1 │ 5 │
      └───┴───┘
      "
    `)
  })
})

describe('MODE()', () => {
  it('should calculate the mode of a set of numbers', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MODE(2, 3, 3, 5, 7, 10)')

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
