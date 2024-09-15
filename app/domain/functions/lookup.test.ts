import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'
import { exampleTests } from '~/test/utils'
import * as functions from './lookup'
await exampleTests(functions)

describe('LOOKUP()', () => {
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'Name:')
    spreadsheet.set('B1', 'Age:')
    spreadsheet.set('A2', 'Alice')
    spreadsheet.set('B2', '25')
    spreadsheet.set('A3', 'Bob')
    spreadsheet.set('B3', '30')
    spreadsheet.set('A4', 'Charlie')
    spreadsheet.set('B4', '35')
    spreadsheet.set('D1', 'Find:')
    spreadsheet.set('E1', 'Result:')

    spreadsheet.set('D2', 'Bob')
    spreadsheet.set('E2', '=LOOKUP(D2, A2:A4, B2:B4)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────┬──────┬───┬───────┬─────────┐
      │   │ A       │ B    │ C │ D     │ E       │
      ├───┼─────────┼──────┼───┼───────┼─────────┤
      │ 1 │ Name:   │ Age: │   │ Find: │ Result: │
      ├───┼─────────┼──────┼───┼───────┼─────────┤
      │ 2 │ Alice   │ 25   │   │ Bob   │ 30      │
      ├───┼─────────┼──────┼───┼───────┼─────────┤
      │ 3 │ Bob     │ 30   │   │       │         │
      ├───┼─────────┼──────┼───┼───────┼─────────┤
      │ 4 │ Charlie │ 35   │   │       │         │
      └───┴─────────┴──────┴───┴───────┴─────────┘
      "
    `)
  })
})
