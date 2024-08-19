import { describe, expect, it } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

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
