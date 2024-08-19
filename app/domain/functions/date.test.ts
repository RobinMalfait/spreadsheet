import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

beforeAll(() => {
  vi.setSystemTime(new Date(2013, 0, 21, 8, 15, 20))
})

describe('NOW()', () => {
  it('should return the current date and time', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┐
      │   │ A                   │
      ├───┼─────────────────────┤
      │ 1 │ 2013-01-21 08:15:20 │
      └───┴─────────────────────┘
      "
    `)
  })
})

describe('TODAY()', () => {
  it('should return the current date and time', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TODAY()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────────┐
      │   │ A          │
      ├───┼────────────┤
      │ 1 │ 2013-01-21 │
      └───┴────────────┘
      "
    `)
  })
})

describe('TIME()', () => {
  it('should return the current time', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TIME()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬──────────┐
      │   │ A        │
      ├───┼──────────┤
      │ 1 │ 08:15:20 │
      └───┴──────────┘
      "
    `)
  })
})

describe('DAY(date)', () => {
  it('should return the day of the given date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=DAY(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬────┐
      │   │ A                   │ B  │
      ├───┼─────────────────────┼────┤
      │ 1 │ 2013-01-21 08:15:20 │ 21 │
      └───┴─────────────────────┴────┘
      "
    `)
  })
})

describe('MONTH(date)', () => {
  it('should return the month of the given date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=MONTH(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬───┐
      │   │ A                   │ B │
      ├───┼─────────────────────┼───┤
      │ 1 │ 2013-01-21 08:15:20 │ 1 │
      └───┴─────────────────────┴───┘
      "
    `)
  })
})

describe('YEAR(date)', () => {
  it('should return the year of the given date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=YEAR(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬──────┐
      │   │ A                   │ B    │
      ├───┼─────────────────────┼──────┤
      │ 1 │ 2013-01-21 08:15:20 │ 2013 │
      └───┴─────────────────────┴──────┘
      "
    `)
  })
})

describe('HOUR(date)', () => {
  it('should return the hour of the given date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=HOUR(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬───┐
      │   │ A                   │ B │
      ├───┼─────────────────────┼───┤
      │ 1 │ 2013-01-21 08:15:20 │ 8 │
      └───┴─────────────────────┴───┘
      "
    `)
  })
})

describe('MINUTE(date)', () => {
  it('should return the minute of the given date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=MINUTE(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬────┐
      │   │ A                   │ B  │
      ├───┼─────────────────────┼────┤
      │ 1 │ 2013-01-21 08:15:20 │ 15 │
      └───┴─────────────────────┴────┘
      "
    `)
  })
})

describe('SECOND(date)', () => {
  it('should return the second of the given date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=SECOND(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬────┐
      │   │ A                   │ B  │
      ├───┼─────────────────────┼────┤
      │ 1 │ 2013-01-21 08:15:20 │ 20 │
      └───┴─────────────────────┴────┘
      "
    `)
  })
})

describe('ADD_DAYS(date, days)', () => {
  it('should add the given number of days to the date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=ADD_DAYS(A1, 5)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬─────────────────────┐
      │   │ A                   │ B                   │
      ├───┼─────────────────────┼─────────────────────┤
      │ 1 │ 2013-01-21 08:15:20 │ 2013-01-26 08:15:20 │
      └───┴─────────────────────┴─────────────────────┘
      "
    `)
  })
})

describe('SUB_DAYS(date, days)', () => {
  it('should subtract the given number of days from the date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=SUB_DAYS(A1, 5)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬─────────────────────┐
      │   │ A                   │ B                   │
      ├───┼─────────────────────┼─────────────────────┤
      │ 1 │ 2013-01-21 08:15:20 │ 2013-01-16 08:15:20 │
      └───┴─────────────────────┴─────────────────────┘
      "
    `)
  })
})

describe('ADD_HOURS(date, days)', () => {
  it('should add the given number of hours to the date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=ADD_HOURS(A1, 8)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬─────────────────────┐
      │   │ A                   │ B                   │
      ├───┼─────────────────────┼─────────────────────┤
      │ 1 │ 2013-01-21 08:15:20 │ 2013-01-21 16:15:20 │
      └───┴─────────────────────┴─────────────────────┘
      "
    `)
  })
})

describe('SUB_DAYS(date, days)', () => {
  it('should subtract the given number of hours from the date', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW()')
    spreadsheet.set('B1', '=SUB_HOURS(A1, 5)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────┬─────────────────────┐
      │   │ A                   │ B                   │
      ├───┼─────────────────────┼─────────────────────┤
      │ 1 │ 2013-01-21 08:15:20 │ 2013-01-21 03:15:20 │
      └───┴─────────────────────┴─────────────────────┘
      "
    `)
  })
})
