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
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: JOIN(delimiter: STRING, ...values: T) Argument \`delimiter\` was not provided
      "
    `)
  })

  it('should error when required argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=JOIN(1, 2, 3, 4, 5)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: JOIN(delimiter: STRING, ...values: T) Argument \`delimiter\` received a \`NUMBER\`
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
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOWER(value: T) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LOWER("Hello", "World")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LOWER(value: T) takes at most 1 argument, got 2
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
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: UPPER(value: T) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=UPPER("Hello", "World")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: UPPER(value: T) takes at most 1 argument, got 2
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
      │ 1 │ Hello World │ HELLO WORLD │ 1 │ LITERAL │ TRUE │ 2013-01-21 │
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
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LEN(value: STRING) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LEN("Hello", "World")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LEN(value: STRING) takes at most 1 argument, got 2
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=LEN(1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: LEN(value: STRING) Argument \`value\` received a \`NUMBER\`
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

describe('TRIM()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRIM()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TRIM(value: STRING) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when passing additional arguments', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRIM("Hello", "World")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TRIM(value: STRING) takes at most 1 argument, got 2
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TRIM(1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TRIM(value: STRING) Argument \`value\` received a \`NUMBER\`
      "
    `)
  })

  it('should trim whitespace from the argument', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '   Hello   ')
    spreadsheet.set('B1', '=TRIM(A1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────┬───────┐
      │   │ A           │ B     │
      ├───┼─────────────┼───────┤
      │ 1 │    Hello    │ Hello │
      └───┴─────────────┴───────┘
      "
    `)
  })
})

describe('FIND_FIRST()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_FIRST()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_FIRST(haystack: STRING, ...needles: STRING) Argument \`haystack\` was not provided
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_FIRST("needle")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_FIRST(haystack: STRING, ...needles: STRING) Argument \`needles\` was not provided
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_FIRST(123, 1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_FIRST(haystack: STRING, ...needles: STRING) Argument \`haystack\` received a \`NUMBER\`
      "
    `)
  })

  it('should result in an empty string when none of the needles are found', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_FIRST(A1, "banana", "apple", "cherry")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬───┐
      │   │ A                                           │ B │
      ├───┼─────────────────────────────────────────────┼───┤
      │ 1 │ The quick brown fox jumps over the lazy dog │   │
      └───┴─────────────────────────────────────────────┴───┘
      "
    `)
  })

  it('should find the first occurrence of any of the needles', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_FIRST(A1, "fox", "dog", "brown")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬───────┐
      │   │ A                                           │ B     │
      ├───┼─────────────────────────────────────────────┼───────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ brown │
      └───┴─────────────────────────────────────────────┴───────┘
      "
    `)
  })
})

describe('FIND_FIRST_INDEX()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_FIRST_INDEX()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_FIRST_INDEX(haystack: STRING, ...needles: STRING) Argument \`haystack\` was not provided
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_FIRST_INDEX("needle")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_FIRST_INDEX(haystack: STRING, ...needles: STRING) Argument \`needles\` was not provided
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_FIRST_INDEX(123, 1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_FIRST_INDEX(haystack: STRING, ...needles: STRING) Argument \`haystack\` received a \`NUMBER\`
      "
    `)
  })

  it('should result in -1 when none of the needles are found', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_FIRST_INDEX(A1, "banana", "apple", "cherry")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬────┐
      │   │ A                                           │ B  │
      ├───┼─────────────────────────────────────────────┼────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ -1 │
      └───┴─────────────────────────────────────────────┴────┘
      "
    `)
  })

  it('should find the position of the first occurrence of any of the needles', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_FIRST_INDEX(A1, "fox", "dog", "brown")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬────┐
      │   │ A                                           │ B  │
      ├───┼─────────────────────────────────────────────┼────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ 10 │
      └───┴─────────────────────────────────────────────┴────┘
      "
    `)
  })
})

describe('FIND_LAST()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_LAST()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_LAST(haystack: STRING, ...needles: STRING) Argument \`haystack\` was not provided
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_LAST("needle")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_LAST(haystack: STRING, ...needles: STRING) Argument \`needles\` was not provided
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_LAST(123, 1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_LAST(haystack: STRING, ...needles: STRING) Argument \`haystack\` received a \`NUMBER\`
      "
    `)
  })

  it('should result in an empty string when none of the needles are found', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_LAST(A1, "banana", "apple", "cherry")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬───┐
      │   │ A                                           │ B │
      ├───┼─────────────────────────────────────────────┼───┤
      │ 1 │ The quick brown fox jumps over the lazy dog │   │
      └───┴─────────────────────────────────────────────┴───┘
      "
    `)
  })

  it('should find the last occurrence of any of the needles', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_LAST(A1, "fox", "dog", "brown")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬─────┐
      │   │ A                                           │ B   │
      ├───┼─────────────────────────────────────────────┼─────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ dog │
      └───┴─────────────────────────────────────────────┴─────┘
      "
    `)
  })
})

describe('FIND_LAST_INDEX()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_LAST_INDEX()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_LAST_INDEX(haystack: STRING, ...needles: STRING) Argument \`haystack\` was not provided
      "
    `)
  })

  it('should error when required second argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_LAST_INDEX("needle")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_LAST_INDEX(haystack: STRING, ...needles: STRING) Argument \`needles\` was not provided
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=FIND_LAST_INDEX(123, 1)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: FIND_LAST_INDEX(haystack: STRING, ...needles: STRING) Argument \`haystack\` received a \`NUMBER\`
      "
    `)
  })

  it('should result in -1 when none of the needles are found', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_LAST_INDEX(A1, "banana", "apple", "cherry")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬────┐
      │   │ A                                           │ B  │
      ├───┼─────────────────────────────────────────────┼────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ -1 │
      └───┴─────────────────────────────────────────────┴────┘
      "
    `)
  })

  it('should find the position of the last occurrence of any of the needles', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=FIND_LAST_INDEX(A1, "fox", "dog", "brown")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬────┐
      │   │ A                                           │ B  │
      ├───┼─────────────────────────────────────────────┼────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ 40 │
      └───┴─────────────────────────────────────────────┴────┘
      "
    `)
  })
})

describe('REPLACE_ALL()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=REPLACE_ALL()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER) Argument \`haystack\` was not provided
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=REPLACE_ALL(123, 1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER) Argument \`haystack\` received a \`NUMBER\`
      "
    `)
  })

  it('should error when the search / replace values do not match', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set(
      'A1',
      '=REPLACE_ALL("one two three four", "one", 1, "two", 2, "three")',
    )

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: REPLACE_ALL() expects an even number of arguments
      "
    `)
  })

  it('should result in the input when there are no replacements', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=REPLACE_ALL("needle")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬────────┐
      │   │ A      │
      ├───┼────────┤
      │ 1 │ needle │
      └───┴────────┘
      "
    `)
  })

  it('should replace all needles with the corresponding replacement', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set(
      'B1',
      '=REPLACE_ALL(A1, "quick", "slow", "fox", "sloth", "jumps", "hops")',
    )

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬─────────────────────────────────────────────┐
      │   │ A                                           │ B                                           │
      ├───┼─────────────────────────────────────────────┼─────────────────────────────────────────────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ The slow brown sloth hops over the lazy dog │
      └───┴─────────────────────────────────────────────┴─────────────────────────────────────────────┘
      "
    `)
  })
})

describe('TEXT_SLICE()', () => {
  it('should error when required argument is not passed', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TEXT_SLICE()')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TEXT_SLICE(value: STRING, start: NUMBER, end?: NUMBER) Argument \`value\` was not provided
      "
    `)
  })

  it('should error when the argument is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TEXT_SLICE(123, 1, 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TEXT_SLICE(value: STRING, start: NUMBER, end?: NUMBER) Argument \`value\` received a \`NUMBER\`
      "
    `)
  })

  it('should error when the start index is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TEXT_SLICE("one two three four", "one", 2)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TEXT_SLICE(value: STRING, start: NUMBER, end?: NUMBER) Argument \`start\` received a \`STRING\`
      "
    `)
  })

  it('should error when the end index is of the wrong type', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', '=TEXT_SLICE("needle", 1, "two")')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬───────┐
      │   │ A     │
      ├───┼───────┤
      │ 1 │ Error │
      └───┴───────┘

      Errors:

      · A1: TEXT_SLICE(value: STRING, start: NUMBER, end?: NUMBER) Argument \`end\` received a \`STRING\`
      "
    `)
  })

  it('should take a slice of the string at the beginning', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=TEXT_SLICE(A1, 0, 19)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬─────────────────────┐
      │   │ A                                           │ B                   │
      ├───┼─────────────────────────────────────────────┼─────────────────────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ The quick brown fox │
      └───┴─────────────────────────────────────────────┴─────────────────────┘
      "
    `)
  })

  it('should take a slice of the string at the end', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=TEXT_SLICE(A1, 40)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬─────┐
      │   │ A                                           │ B   │
      ├───┼─────────────────────────────────────────────┼─────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ dog │
      └───┴─────────────────────────────────────────────┴─────┘
      "
    `)
  })

  it('should take a slice of the string at the end (using negative numbers)', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=TEXT_SLICE(A1, -3)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬─────┐
      │   │ A                                           │ B   │
      ├───┼─────────────────────────────────────────────┼─────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ dog │
      └───┴─────────────────────────────────────────────┴─────┘
      "
    `)
  })

  it('should take a slice of the string in the middle', () => {
    let spreadsheet = new Spreadsheet()
    spreadsheet.set('A1', 'The quick brown fox jumps over the lazy dog')
    spreadsheet.set('B1', '=TEXT_SLICE(A1, 10, 19)')

    expect(visualizeSpreadsheet(spreadsheet)).toMatchInlineSnapshot(`
      "
      ┌───┬─────────────────────────────────────────────┬───────────┐
      │   │ A                                           │ B         │
      ├───┼─────────────────────────────────────────────┼───────────┤
      │ 1 │ The quick brown fox jumps over the lazy dog │ brown fox │
      └───┴─────────────────────────────────────────────┴───────────┘
      "
    `)
  })
})
