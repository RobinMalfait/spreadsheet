import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Spreadsheet } from '~/domain/spreadsheet'
import { visualizeSpreadsheet } from '~/test/utils'

beforeAll(() => {
  vi.setSystemTime(new Date(2013, 0, 21, 8, 15, 20))
})

describe('NOW()', () => {
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=NOW(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: NOW() does not take any arguments
      "
    `)
  })

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
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TODAY(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TODAY() does not take any arguments
      "
    `)
  })

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
  it('should error when providing an argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TIME(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TIME() does not take any arguments
      "
    `)
  })

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DAY()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DAY() requires a date
      "
    `)
  })

  it('should error when required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DAY(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DAY() requires a date
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=DAY(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: DAY() does not take more than one argument
      "
    `)
  })

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MONTH()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MONTH() requires a date
      "
    `)
  })

  it('should error when required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MONTH(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MONTH() requires a date
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MONTH(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MONTH() does not take more than one argument
      "
    `)
  })

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=YEAR()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: YEAR() requires a date
      "
    `)
  })

  it('should error when required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=YEAR(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: YEAR() requires a date
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=YEAR(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: YEAR() does not take more than one argument
      "
    `)
  })

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=HOUR()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: HOUR() requires a date
      "
    `)
  })

  it('should error when required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=HOUR(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: HOUR() requires a date
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=HOUR(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: HOUR() does not take more than one argument
      "
    `)
  })

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MINUTE()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MINUTE() requires a date
      "
    `)
  })

  it('should error when required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MINUTE(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MINUTE() requires a date
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=MINUTE(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: MINUTE() does not take more than one argument
      "
    `)
  })

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
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SECOND()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SECOND() requires a date
      "
    `)
  })

  it('should error when required argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SECOND(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SECOND() requires a date
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SECOND(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SECOND() does not take more than one argument
      "
    `)
  })

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
  it('should error when required first argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_DAYS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_DAYS() requires a date
      "
    `)
  })

  it('should error when required first argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_DAYS(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_DAYS() requires a date
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_DAYS(NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_DAYS() requires a number of days
      "
    `)
  })

  it('should error when required second argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_DAYS(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_DAYS() requires a number of days
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_DAYS(NOW(), 123, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_DAYS() does not take more than two arguments
      "
    `)
  })

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
  it('should error when required first argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_DAYS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_DAYS() requires a date
      "
    `)
  })

  it('should error when required first argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_DAYS(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_DAYS() requires a date
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_DAYS(NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_DAYS() requires a number of days
      "
    `)
  })

  it('should error when required second argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_DAYS(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_DAYS() requires a number of days
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_DAYS(NOW(), 123, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_DAYS() does not take more than two arguments
      "
    `)
  })

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
  it('should error when required first argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_HOURS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_HOURS() requires a date
      "
    `)
  })

  it('should error when required first argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_HOURS(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_HOURS() requires a date
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_HOURS(NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_HOURS() requires a number of hours
      "
    `)
  })

  it('should error when required second argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_HOURS(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_HOURS() requires a number of hours
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=ADD_HOURS(NOW(), 123, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: ADD_HOURS() does not take more than two arguments
      "
    `)
  })

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
  it('should error when required first argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_HOURS()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_HOURS() requires a date
      "
    `)
  })

  it('should error when required first argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_HOURS(123)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_HOURS() requires a date
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_HOURS(NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_HOURS() requires a number of hours
      "
    `)
  })

  it('should error when required second argument is not the right type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_HOURS(NOW(), NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_HOURS() requires a number of hours
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=SUB_HOURS(NOW(), 123, NOW())')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: SUB_HOURS() does not take more than two arguments
      "
    `)
  })

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
