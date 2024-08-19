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

it('should print the cell after parsing', () => {
  expect(printLocation(parseLocation('A1'))).toEqual('A1')
  expect(printLocation(parseLocation('A10'))).toEqual('A10')

  expect(printLocation(parseLocation('Z1'))).toEqual('Z1')
  expect(printLocation(parseLocation('Z10'))).toEqual('Z10')

  expect(printLocation(parseLocation('AA1'))).toEqual('AA1')
  expect(printLocation(parseLocation('AA10'))).toEqual('AA10')

  expect(printLocation(parseLocation('AZ1'))).toEqual('AZ1')
  expect(printLocation(parseLocation('AZ10'))).toEqual('AZ10')
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
    it('should parse the `=` operator', () => {
      expect(printExpression(parse(tokenize('1 = 2')))).toMatchInlineSnapshot(`"1 = 2"`)
    })

    it('should parse the `!=` operator', () => {
      expect(printExpression(parse(tokenize('1 <> 2')))).toMatchInlineSnapshot(`"1 <> 2"`)
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
    it('should parse a cell reference', () => {
      expect(printExpression(parse(tokenize('A1')))).toMatchInlineSnapshot(`"A1"`)
      expect(printExpression(parse(tokenize('A23')))).toMatchInlineSnapshot(`"A23"`)
      expect(printExpression(parse(tokenize('AZ99')))).toMatchInlineSnapshot(`"AZ99"`)
    })
  })

  describe('cell range', () => {
    it('should parse a cell range', () => {
      expect(printExpression(parse(tokenize('A1:B2')))).toMatchInlineSnapshot(`"A1:B2"`)
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
    let input = 'JOIN(" + ", SUM(A1:B1, PRODUCT(A1:B1)), PI())'
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
       0 | JOIN(" + ", SUM(A1:B1, PRODUCT(A1:B1)), PI())
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
      "
    `)
  })

  // Kitchen sink example testing the actual data structure and re-printed
  // expression
  it('should work with a complex expression', () => {
    let input = 'JOIN(" + ", SUM(A1:B1), 1 * -1 - 2.0 ^ -2.0, PI() <> 3.14)'
    let ast = parse(tokenize(input))

    expect(printExpression(ast)).toMatchInlineSnapshot(
      `"JOIN(" + ", SUM(A1:B1), ((1 * -1) - (2 ^ -2)), (PI() <> 3.14))"`,
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
                    "row": 1,
                  },
                  "name": "B1",
                  "span": {
                    "end": 21,
                    "start": 19,
                  },
                },
                "kind": "RANGE",
                "span": {
                  "end": 21,
                  "start": 16,
                },
                "start": {
                  "kind": "CELL",
                  "loc": {
                    "col": 1,
                    "row": 1,
                  },
                  "name": "A1",
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
