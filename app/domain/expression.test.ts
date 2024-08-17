import { describe, expect, it } from 'vitest'
import {
  parseColNumber,
  parseExpression,
  parseLocation,
  printExpression,
  printLocation,
} from './expression'
import { WalkAction, walk } from './spreadsheet'
import { tokenize } from './tokenizer'

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
      expect(parseExpression(tokenize('123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "span": {
            "end": 3,
            "start": 0,
          },
          "value": 123,
        }
      `)
    })

    it('should parse a static negative number value', () => {
      expect(parseExpression(tokenize('-123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "span": {
            "end": 4,
            "start": 0,
          },
          "value": -123,
        }
      `)
    })

    it('should parse a static float value', () => {
      expect(parseExpression(tokenize('123.456'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "span": {
            "end": 7,
            "start": 0,
          },
          "value": 123.456,
        }
      `)
    })

    it('should parse a static negative float value', () => {
      expect(parseExpression(tokenize('-123.456'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "span": {
            "end": 8,
            "start": 0,
          },
          "value": -123.456,
        }
      `)
    })
  })

  describe('string literal', () => {
    it('should parse a static string value', () => {
      expect(parseExpression(tokenize('"hello world"'))).toMatchInlineSnapshot(json`
        {
          "kind": "STRING_LITERAL",
          "span": {
            "end": 13,
            "start": 0,
          },
          "value": "hello world",
        }
      `)
    })
  })

  describe('logic operators', () => {
    it('should parse the `=` operator', () => {
      expect(parseExpression(tokenize('1 = 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "EQUALS",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 5,
              "start": 4,
            },
            "value": 2,
          },
          "span": {
            "end": 5,
            "start": 0,
          },
        }
      `)
    })

    it('should parse the `<>` operator', () => {
      expect(parseExpression(tokenize('1 <> 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "NOT_EQUALS",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 6,
              "start": 5,
            },
            "value": 2,
          },
          "span": {
            "end": 6,
            "start": 0,
          },
        }
      `)
    })

    it('should parse the `>` operator', () => {
      expect(parseExpression(tokenize('1 > 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "GREATER_THAN",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 5,
              "start": 4,
            },
            "value": 2,
          },
          "span": {
            "end": 5,
            "start": 0,
          },
        }
      `)
    })

    it('should parse the `>=` operator', () => {
      expect(parseExpression(tokenize('1 >= 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "GREATER_THAN_EQUALS",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 6,
              "start": 5,
            },
            "value": 2,
          },
          "span": {
            "end": 6,
            "start": 0,
          },
        }
      `)
    })

    it('should parse the `<` operator', () => {
      expect(parseExpression(tokenize('1 < 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "LESS_THAN",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 5,
              "start": 4,
            },
            "value": 2,
          },
          "span": {
            "end": 5,
            "start": 0,
          },
        }
      `)
    })

    it('should parse the `<=` operator', () => {
      expect(parseExpression(tokenize('1 <= 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "LESS_THAN_EQUALS",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 6,
              "start": 5,
            },
            "value": 2,
          },
          "span": {
            "end": 6,
            "start": 0,
          },
        }
      `)
    })
  })

  describe('math operators', () => {
    it('should parse the unary minus operator', () => {
      expect(parseExpression(tokenize('-123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "span": {
            "end": 4,
            "start": 0,
          },
          "value": -123,
        }
      `)
    })

    it('should parse the unary plus operator', () => {
      expect(parseExpression(tokenize('+123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "span": {
            "end": 4,
            "start": 0,
          },
          "value": 123,
        }
      `)
    })

    it('should parse a simple binary math expression', () => {
      expect(parseExpression(tokenize('1 + 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "ADD",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 5,
              "start": 4,
            },
            "value": 2,
          },
          "span": {
            "end": 5,
            "start": 0,
          },
        }
      `)
    })

    it('should parse a simple binary math expression with cell references', () => {
      expect(parseExpression(tokenize('A1 + 2'))).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "CELL",
            "loc": {
              "col": 1,
              "row": 1,
            },
            "name": "A1",
            "span": {
              "end": 2,
              "start": 0,
            },
          },
          "operator": "ADD",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 6,
              "start": 5,
            },
            "value": 2,
          },
          "span": {
            "end": 6,
            "start": 0,
          },
        }
      `)
    })

    it('should parse a simple binary match expression with 3 arguments', () => {
      expect(parseExpression(tokenize('1 + 2 + 3'))).toMatchInlineSnapshot(
        json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 1,
                "start": 0,
              },
              "value": 1,
            },
            "operator": "ADD",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 5,
                "start": 4,
              },
              "value": 2,
            },
            "span": {
              "end": 5,
              "start": 0,
            },
          },
          "operator": "ADD",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 9,
              "start": 8,
            },
            "value": 3,
          },
          "span": {
            "end": 9,
            "start": 0,
          },
        }
      `,
      )
    })

    it('should parse a math expression with the correct operator precedence', () => {
      expect(parseExpression(tokenize('1 + 2 * 3 / 4'))).toMatchInlineSnapshot(
        json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 1,
              "start": 0,
            },
            "value": 1,
          },
          "operator": "ADD",
          "rhs": {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "BINARY_EXPRESSION",
              "lhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 5,
                  "start": 4,
                },
                "value": 2,
              },
              "operator": "MULTIPLY",
              "rhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 9,
                  "start": 8,
                },
                "value": 3,
              },
              "span": {
                "end": 9,
                "start": 4,
              },
            },
            "operator": "DIVIDE",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 13,
                "start": 12,
              },
              "value": 4,
            },
            "span": {
              "end": 13,
              "start": 4,
            },
          },
          "span": {
            "end": 13,
            "start": 0,
          },
        }
      `,
      )
    })

    it('should parse a math expression with parenthesis', () => {
      expect(parseExpression(tokenize('(1 + 2) * 3'))).toMatchInlineSnapshot(
        json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 2,
                "start": 1,
              },
              "value": 1,
            },
            "operator": "ADD",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 6,
                "start": 5,
              },
              "value": 2,
            },
            "span": {
              "end": 6,
              "start": 1,
            },
          },
          "operator": "MULTIPLY",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "span": {
              "end": 11,
              "start": 10,
            },
            "value": 3,
          },
          "span": {
            "end": 11,
            "start": 1,
          },
        }
      `,
      )
    })

    it('should parse a math expression with parentheses and multiple arguments', () => {
      expect(
        parseExpression(tokenize('(1 + 2) * 3 + (4 + 5)')),
      ).toMatchInlineSnapshot(json`
        {
          "kind": "BINARY_EXPRESSION",
          "lhs": {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "BINARY_EXPRESSION",
              "lhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 2,
                  "start": 1,
                },
                "value": 1,
              },
              "operator": "ADD",
              "rhs": {
                "kind": "NUMBER_LITERAL",
                "span": {
                  "end": 6,
                  "start": 5,
                },
                "value": 2,
              },
              "span": {
                "end": 6,
                "start": 1,
              },
            },
            "operator": "MULTIPLY",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 11,
                "start": 10,
              },
              "value": 3,
            },
            "span": {
              "end": 11,
              "start": 1,
            },
          },
          "operator": "ADD",
          "rhs": {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 16,
                "start": 15,
              },
              "value": 4,
            },
            "operator": "ADD",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 20,
                "start": 19,
              },
              "value": 5,
            },
            "span": {
              "end": 20,
              "start": 15,
            },
          },
          "span": {
            "end": 20,
            "start": 1,
          },
        }
      `)
    })
  })

  describe('cell reference', () => {
    it('should parse a cell reference', () => {
      expect(parseExpression(tokenize('A1'))).toMatchInlineSnapshot(json`
        {
          "kind": "CELL",
          "loc": {
            "col": 1,
            "row": 1,
          },
          "name": "A1",
          "span": {
            "end": 2,
            "start": 0,
          },
        }
      `)
      expect(parseExpression(tokenize('A23'))).toMatchInlineSnapshot(json`
        {
          "kind": "CELL",
          "loc": {
            "col": 1,
            "row": 23,
          },
          "name": "A23",
          "span": {
            "end": 3,
            "start": 0,
          },
        }
      `)
      expect(parseExpression(tokenize('AZ99'))).toMatchInlineSnapshot(json`
        {
          "kind": "CELL",
          "loc": {
            "col": 52,
            "row": 99,
          },
          "name": "AZ99",
          "span": {
            "end": 4,
            "start": 0,
          },
        }
      `)
    })
  })

  describe('cell range', () => {
    it('should parse a cell range', () => {
      expect(parseExpression(tokenize('A1:B2'))).toMatchInlineSnapshot(json`
        {
          "end": {
            "kind": "CELL",
            "loc": {
              "col": 2,
              "row": 2,
            },
            "name": "B2",
            "span": {
              "end": 5,
              "start": 3,
            },
          },
          "kind": "RANGE",
          "span": {
            "end": 5,
            "start": 0,
          },
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 1,
              "row": 1,
            },
            "name": "A1",
            "span": {
              "end": 2,
              "start": 0,
            },
          },
        }
      `)
      expect(parseExpression(tokenize('A1:B20'))).toMatchInlineSnapshot(json`
        {
          "end": {
            "kind": "CELL",
            "loc": {
              "col": 2,
              "row": 20,
            },
            "name": "B20",
            "span": {
              "end": 6,
              "start": 3,
            },
          },
          "kind": "RANGE",
          "span": {
            "end": 6,
            "start": 0,
          },
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 1,
              "row": 1,
            },
            "name": "A1",
            "span": {
              "end": 2,
              "start": 0,
            },
          },
        }
      `)
      expect(parseExpression(tokenize('A20:B2'))).toMatchInlineSnapshot(json`
        {
          "end": {
            "kind": "CELL",
            "loc": {
              "col": 2,
              "row": 2,
            },
            "name": "B2",
            "span": {
              "end": 6,
              "start": 4,
            },
          },
          "kind": "RANGE",
          "span": {
            "end": 6,
            "start": 0,
          },
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 1,
              "row": 20,
            },
            "name": "A20",
            "span": {
              "end": 3,
              "start": 0,
            },
          },
        }
      `)
      expect(parseExpression(tokenize('AA10:ZZ99'))).toMatchInlineSnapshot(json`
        {
          "end": {
            "kind": "CELL",
            "loc": {
              "col": 702,
              "row": 99,
            },
            "name": "ZZ99",
            "span": {
              "end": 9,
              "start": 5,
            },
          },
          "kind": "RANGE",
          "span": {
            "end": 9,
            "start": 0,
          },
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 27,
              "row": 10,
            },
            "name": "AA10",
            "span": {
              "end": 4,
              "start": 0,
            },
          },
        }
      `)
    })
  })

  describe('functions', () => {
    it('should parse a simple function call', () => {
      expect(parseExpression(tokenize('SUM(1, 2, 3)'))).toMatchInlineSnapshot(
        json`
        {
          "args": [
            {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 5,
                "start": 4,
              },
              "value": 1,
            },
            {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 8,
                "start": 7,
              },
              "value": 2,
            },
            {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 11,
                "start": 10,
              },
              "value": 3,
            },
          ],
          "kind": "FUNCTION",
          "name": "SUM",
          "span": {
            "end": 12,
            "start": 0,
          },
        }
      `,
      )
    })

    it('should parse a function call with cell, ranges and literals', () => {
      expect(parseExpression(tokenize('SUM(1, A1, A3:B8)'))).toMatchInlineSnapshot(json`
        {
          "args": [
            {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 5,
                "start": 4,
              },
              "value": 1,
            },
            {
              "kind": "CELL",
              "loc": {
                "col": 1,
                "row": 1,
              },
              "name": "A1",
              "span": {
                "end": 9,
                "start": 7,
              },
            },
            {
              "end": {
                "kind": "CELL",
                "loc": {
                  "col": 2,
                  "row": 8,
                },
                "name": "B8",
                "span": {
                  "end": 16,
                  "start": 14,
                },
              },
              "kind": "RANGE",
              "span": {
                "end": 16,
                "start": 11,
              },
              "start": {
                "kind": "CELL",
                "loc": {
                  "col": 1,
                  "row": 3,
                },
                "name": "A3",
                "span": {
                  "end": 13,
                  "start": 11,
                },
              },
            },
          ],
          "kind": "FUNCTION",
          "name": "SUM",
          "span": {
            "end": 17,
            "start": 0,
          },
        }
      `)
    })

    it('should parse nested function calls', () => {
      expect(
        parseExpression(tokenize('SUM(1, SUM(2, 3, 4), 5)')),
      ).toMatchInlineSnapshot(json`
        {
          "args": [
            {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 5,
                "start": 4,
              },
              "value": 1,
            },
            {
              "args": [
                {
                  "kind": "NUMBER_LITERAL",
                  "span": {
                    "end": 12,
                    "start": 11,
                  },
                  "value": 2,
                },
                {
                  "kind": "NUMBER_LITERAL",
                  "span": {
                    "end": 15,
                    "start": 14,
                  },
                  "value": 3,
                },
                {
                  "kind": "NUMBER_LITERAL",
                  "span": {
                    "end": 18,
                    "start": 17,
                  },
                  "value": 4,
                },
              ],
              "kind": "FUNCTION",
              "name": "SUM",
              "span": {
                "end": 19,
                "start": 7,
              },
            },
            {
              "kind": "NUMBER_LITERAL",
              "span": {
                "end": 22,
                "start": 21,
              },
              "value": 5,
            },
          ],
          "kind": "FUNCTION",
          "name": "SUM",
          "span": {
            "end": 23,
            "start": 0,
          },
        }
      `)
    })
  })

  it('should have the correct spans', () => {
    let input = 'JOIN(" + ", SUM(A1:B1, PRODUCT(A1:B1)), PI())'
    let ast = parseExpression(tokenize(input))

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
})
