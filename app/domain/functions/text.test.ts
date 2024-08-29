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

      · A1: JOIN() expects a string as the delimiter, got <nothing>
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

      · A1: JOIN() expects a string as the delimiter, got 1
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

      · A1: LOWER() expects a value as the first argument, got <nothing>
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

      · A1: LOWER() does not take more than one argument, got World
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

      · A1: UPPER() expects a value as the first argument, got <nothing>
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

      · A1: UPPER() does not take more than one argument, got World
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

      · A1: LEN() expects a value as the first argument, got <nothing>
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

      · A1: LEN() does not take more than one argument, got World
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

      · A1: LEN() expects a string as the first argument, got 1
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

      · A1: TRIM() expects a value as the first argument, got <nothing>
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

      · A1: TRIM() does not take more than one argument, got World
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

      · A1: TRIM() expects a string as the first argument, got 1
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

      · A1: FIND_FIRST() expects a string as the first argument, got <nothing>
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

      · A1: FIND_FIRST() expects at least one needle
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

      · A1: FIND_FIRST() expects a string as the first argument, got 123
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

      · A1: FIND_LAST() expects a string as the first argument, got <nothing>
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

      · A1: FIND_LAST() expects at least one needle
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

      · A1: FIND_LAST() expects a string as the first argument, got 123
      "
    `)
  })

  it('should find the first occurrence of any of the needles', () => {
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

      · A1: REPLACE_ALL() expects a string as the first three arguments, got <nothing>
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

      · A1: REPLACE_ALL() expects a string as the first three arguments, got 123
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

      · A1: TEXT_SLICE() expects a string as the first argument, got <nothing>
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

      · A1: TEXT_SLICE() expects a string as the first argument, got 123
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

      · A1: TEXT_SLICE() expects a number as the second argument, got one
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

      · A1: TEXT_SLICE() expects a number as the third argument, got two
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
