import { describe, expect, it } from 'vitest'
import {
  parse,
  parseColNumber,
  parseLocation,
  printExpression,
  printLocation,
} from '~/domain/expression'
import { tokenize } from '~/domain/tokenizer'
import { WalkAction, walk } from '~/domain/walk-ast'

const json = String.raw

it('should parse the column number', () => {
  expect(parseColNumber('A')).toEqual(1)
  expect(parseColNumber('Z')).toEqual(26)

  expect(parseColNumber('AA')).toEqual(27)
  expect(parseColNumber('AZ')).toEqual(52)

  expect(parseColNumber('BA')).toEqual(53)
  expect(parseColNumber('BZ')).toEqual(78)

  expect(parseColNumber('ZA')).toEqual(677)
  expect(parseColNumber('ZZ')).toEqual(702)
})

it.each([
  ['A1'],
  ['$A1'],
  ['$A$1'],
  ['A$1'],
  ['A10'],
  ['$A10'],
  ['$A$10'],
  ['A$10'],

  ['Z1'],
  ['$Z1'],
  ['$Z$1'],
  ['Z$1'],
  ['Z10'],
  ['$Z10'],
  ['$Z$10'],
  ['Z$10'],

  ['AA1'],
  ['$AA1'],
  ['$AA$1'],
  ['AA$1'],
  ['AA10'],
  ['$AA10'],
  ['$AA$10'],
  ['AA$10'],

  ['AZ1'],
  ['$AZ1'],
  ['$AZ$1'],
  ['AZ$1'],
  ['AZ10'],
  ['$AZ10'],
  ['$AZ$10'],
  ['AZ$10'],
])('should print the cell %s after parsing', (cell) => {
  expect(printLocation(parseLocation(cell), true)).toEqual(cell)
})

describe('parsing', () => {
  describe('number literal', () => {
    it('should parse a static number value', () => {
      expect(printExpression(parse(tokenize('123')))).toMatchInlineSnapshot(`"123"`)
    })

    it('should parse a static negative number value', () => {
      expect(printExpression(parse(tokenize('-123')))).toMatchInlineSnapshot(`"-123"`)
    })

    it('should parse a static float value', () => {
      expect(printExpression(parse(tokenize('123.456')))).toMatchInlineSnapshot(
        `"123.456"`,
      )
    })

    it('should parse a static negative float value', () => {
      expect(printExpression(parse(tokenize('-123.456')))).toMatchInlineSnapshot(
        `"-123.456"`,
      )
    })
  })

  describe('string literal', () => {
    it('should parse a static string value', () => {
      expect(printExpression(parse(tokenize('"hello world"')))).toMatchInlineSnapshot(
        `""hello world""`,
      )
    })
  })

  describe('logic operators', () => {
    it('should parse the `==` operator', () => {
      expect(printExpression(parse(tokenize('1 == 2')))).toMatchInlineSnapshot(`"1 == 2"`)
    })

    it('should parse the `!=` operator', () => {
      expect(printExpression(parse(tokenize('1 != 2')))).toMatchInlineSnapshot(`"1 != 2"`)
    })

    it('should parse the `>` operator', () => {
      expect(printExpression(parse(tokenize('1 > 2')))).toMatchInlineSnapshot(`"1 > 2"`)
    })

    it('should parse the `>=` operator', () => {
      expect(printExpression(parse(tokenize('1 >= 2')))).toMatchInlineSnapshot(`"1 >= 2"`)
    })

    it('should parse the `<` operator', () => {
      expect(printExpression(parse(tokenize('1 < 2')))).toMatchInlineSnapshot(`"1 < 2"`)
    })

    it('should parse the `<=` operator', () => {
      expect(printExpression(parse(tokenize('1 <= 2')))).toMatchInlineSnapshot(`"1 <= 2"`)
    })
  })

  describe('math operators', () => {
    it('should parse the `^` operator', () => {
      expect(printExpression(parse(tokenize('1 ^ 2')))).toMatchInlineSnapshot(`"1 ^ 2"`)
    })

    it('should parse the `*` operator', () => {
      expect(printExpression(parse(tokenize('1 * 2')))).toMatchInlineSnapshot(`"1 * 2"`)
    })

    it('should parse the `/` operator', () => {
      expect(printExpression(parse(tokenize('1 / 2')))).toMatchInlineSnapshot(`"1 / 2"`)
    })

    it('should parse the `+` operator', () => {
      expect(printExpression(parse(tokenize('1 + 2')))).toMatchInlineSnapshot(`"1 + 2"`)
    })

    it('should parse the `-` operator', () => {
      expect(printExpression(parse(tokenize('1 - 2')))).toMatchInlineSnapshot(`"1 - 2"`)
    })

    it('should parse the unary minus operator', () => {
      expect(printExpression(parse(tokenize('-123')))).toMatchInlineSnapshot(`"-123"`)
    })

    it('should parse the unary plus operator', () => {
      expect(printExpression(parse(tokenize('+123')))).toMatchInlineSnapshot(`"123"`)
    })

    it('should parse a simple binary math expression', () => {
      expect(printExpression(parse(tokenize('1 + 2')))).toMatchInlineSnapshot(`"1 + 2"`)
    })

    it('should parse a simple binary math expression with cell references', () => {
      expect(printExpression(parse(tokenize('A1 + 2')))).toMatchInlineSnapshot(`"A1 + 2"`)
    })

    it('should parse a simple binary match expression with 3 arguments', () => {
      expect(printExpression(parse(tokenize('1 + 2 + 3')))).toMatchInlineSnapshot(
        `"(1 + 2) + 3"`,
      )
    })

    it('should parse a math expression with the correct operator precedence', () => {
      expect(printExpression(parse(tokenize('1 + 2 * 3 / 4')))).toMatchInlineSnapshot(
        `"1 + ((2 * 3) / 4)"`,
      )
    })

    it('should parse a math expression with parenthesis', () => {
      expect(printExpression(parse(tokenize('(1 + 2) * 3')))).toMatchInlineSnapshot(
        `"(1 + 2) * 3"`,
      )
    })

    it('should parse a math expression with parentheses and multiple arguments', () => {
      expect(
        printExpression(parse(tokenize('(1 + 2) * 3 + (4 + 5)'))),
      ).toMatchInlineSnapshot(`"((1 + 2) * 3) + (4 + 5)"`)
    })

    it('should error when writing implicit multiplication', () => {
      expect(() => parse(tokenize('5(3)'))).toThrowError('Invalid expression')
    })
  })

  describe('cell reference', () => {
    it.each([
      // NOT LOCKED
      // Single char col and row
      ['A1'],

      // Single char col, multiple char row
      ['A23'],

      // Multiple char col, single char row
      ['AZ1'],

      // Multiple char col and row
      ['AZ23'],

      // LOCKED
      // Single char col and row
      ['$A$1'],
      ['A$1'],
      ['$A1'],

      // Single char col, multiple char row
      ['$A$23'],
      ['A$23'],
      ['$A23'],

      // Multiple char col, single char row
      ['$AZ$1'],
      ['AZ$1'],
      ['$AZ1'],

      // Multiple char col and row
      ['$AZ$23'],
      ['AZ$23'],
      ['$AZ23'],
    ])('should parse a cell (%s) reference', (cell) => {
      expect(printExpression(parse(tokenize(cell)))).toEqual(cell)
    })
  })

  describe('cell range', () => {
    let options = [
      // NOT LOCKED
      // Single char col and row
      'A1',

      // Single char col, multiple char row
      'A23',

      // Multiple char col, single char row
      'AZ1',

      // Multiple char col and row
      'AZ23',

      // LOCKED
      // Single char col and row
      '$A$1',
      'A$1',
      '$A1',

      // Single char col, multiple char row
      '$A$23',
      'A$23',
      '$A23',

      // Multiple char col, single char row
      '$AZ$1',
      'AZ$1',
      '$AZ1',

      // Multiple char col and row
      '$AZ$23',
      'AZ$23',
      '$AZ23',
    ]

    let combinations = []
    for (let lhs of options) {
      for (let rhs of options) {
        combinations.push([`${lhs}:${rhs}`])
      }
    }

    it.each(combinations)('should parse a cell range (%s)', (range) => {
      expect(printExpression(parse(tokenize(range)))).toEqual(range)
    })

    it('should parse a cell range', () => {
      expect(printExpression(parse(tokenize('A1:B20')))).toMatchInlineSnapshot(`"A1:B20"`)
      expect(printExpression(parse(tokenize('A20:B2')))).toMatchInlineSnapshot(`"A20:B2"`)
      expect(printExpression(parse(tokenize('AA10:ZZ99')))).toMatchInlineSnapshot(
        `"AA10:ZZ99"`,
      )
    })
  })

  describe('functions', () => {
    it('should parse a simple function call', () => {
      expect(printExpression(parse(tokenize('SUM(1, 2, 3)')))).toMatchInlineSnapshot(
        `"SUM(1, 2, 3)"`,
      )
    })

    it('should parse a function call with cell, ranges and literals', () => {
      expect(printExpression(parse(tokenize('SUM(1, A1, A3:B8)')))).toMatchInlineSnapshot(
        `"SUM(1, A1, A3:B8)"`,
      )
    })

    it('should parse nested function calls', () => {
      expect(
        printExpression(parse(tokenize('SUM(1, SUM(2, 3, 4), 5)'))),
      ).toMatchInlineSnapshot(`"SUM(1, SUM(2, 3, 4), 5)"`)
    })
  })

  it('should have the correct spans', () => {
    let input = 'JOIN(" + ", SUM(A1:B1, PRODUCT(A1:B1)), PI(), SUM($A$1:A$3))'
    let ast = parse(tokenize(input))

    let parts: string[] = []
    walk([ast], (node, _parent, depth) => {
      parts.push(
        `${depth.toString().padStart(2, ' ')} | ${'  '.repeat(depth)}${input.slice(node.span.start, node.span.end)}`,
      )
      return WalkAction.Continue
    })

    expect(`\n${parts.join('\n')}\n`).toMatchInlineSnapshot(`
      "
       0 | JOIN(" + ", SUM(A1:B1, PRODUCT(A1:B1)), PI(), SUM($A$1:A$3))
       1 |   " + "
       1 |   SUM(A1:B1, PRODUCT(A1:B1))
       2 |     A1:B1
       3 |       A1:B1
       3 |       A1:B1
       2 |     PRODUCT(A1:B1)
       3 |       A1:B1
       4 |         A1:B1
       4 |         A1:B1
       1 |   PI()
       1 |   SUM($A$1:A$3)
       2 |     $A$1:A$3
       3 |       $A$1:A$3
       3 |       $A$1:A$3
       3 |       $A$1:A$3
      "
    `)
  })

  // Kitchen sink example testing the actual data structure and re-printed
  // expression
  it('should work with a complex expression', () => {
    let input = 'JOIN(" + ", SUM(A1:B1), 1 * -1 - 2.0 ^ -2.0, PI() != 3.14)'
    let ast = parse(tokenize(input))

    expect(printExpression(ast)).toMatchInlineSnapshot(
      `"JOIN(" + ", SUM(A1:B1), ((1 * -1) - (2 ^ -2)), (PI() != 3.14))"`,
    )
    expect(ast).toMatchInlineSnapshot(json`
      {
        "args": [
          {
            "kind": "STRING_LITERAL",
            "span": {
              "end": 10,
              "start": 5,
            },
            "value": " + ",
          },
          {
            "args": [
              {
                "end": {
                  "kind": "CELL",
                  "loc": {
                    "col": 2,
                    "lock": 0,
                    "row": 1,
                  },
                  "name": "B1",
                  "raw": "B1",
                  "span": {
                    "end": 21,
                    "start": 19,
                  },
                },
                "kind": "RANGE",
                "raw": "A1:B1",
                "span": {
                  "end": 21,
                  "start": 16,
                },
                "start": {
                  "kind": "CELL",
                  "loc": {
                    "col": 1,
                    "lock": 0,
                    "row": 1,
                  },
                  "name": "A1",
                  "raw": "A1",
                  "span": {
                    "end": 18,
                    "start": 16,
                  },
                },
              },
            ],
            "kind": "FUNCTION",
            "name": "SUM",
            "span": {
              "end": 22,
              "start": 12,
            },
          },
          {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "BINARY_EXPRESSION",
              "lhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 25,
                  "start": 24,
                },
                "value": 1,
              },
              "operator": "MULTIPLY",
              "rhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 30,
                  "start": 28,
                },
                "value": -1,
              },
              "span": {
                "end": 30,
                "start": 24,
              },
            },
            "operator": "SUBTRACT",
            "rhs": {
              "kind": "BINARY_EXPRESSION",
              "lhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 36,
                  "start": 33,
                },
                "value": 2,
              },
              "operator": "EXPONENT",
              "rhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 43,
                  "start": 39,
                },
                "value": -2,
              },
              "span": {
                "end": 43,
                "start": 33,
              },
            },
            "span": {
              "end": 43,
              "start": 24,
            },
          },
          {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "args": [],
              "kind": "FUNCTION",
              "name": "PI",
              "span": {
                "end": 49,
                "start": 45,
              },
            },
            "operator": "NOT_EQUALS",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 57,
                "start": 53,
              },
              "value": 3.14,
            },
            "span": {
              "end": 57,
              "start": 45,
            },
          },
        ],
        "kind": "FUNCTION",
        "name": "JOIN",
        "span": {
          "end": 58,
          "start": 0,
        },
      }
    `)
  })
})
