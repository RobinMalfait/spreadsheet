import { describe, expect, it } from 'vitest'
import {
  parseColNumber,
  parseExpression,
  parseLocation,
  printLocation,
} from './expression'
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
          "value": 123,
        }
      `)
    })

    it('should parse a static negative number value', () => {
      expect(parseExpression(tokenize('-123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "value": -123,
        }
      `)
    })

    it('should parse a static float value', () => {
      expect(parseExpression(tokenize('123.456'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "value": 123.456,
        }
      `)
    })

    it('should parse a static negative float value', () => {
      expect(parseExpression(tokenize('-123.456'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
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
          "value": "hello world",
        }
      `)
    })
  })

  describe('math operators', () => {
    it('should parse the unary minus operator', () => {
      expect(parseExpression(tokenize('-123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
          "value": -123,
        }
      `)
    })

    it('should parse the unary plus operator', () => {
      expect(parseExpression(tokenize('+123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER_LITERAL",
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
            "value": 1,
          },
          "operator": "ADD",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "value": 2,
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
          },
          "operator": "ADD",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "value": 2,
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
              "value": 1,
            },
            "operator": "ADD",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "value": 2,
            },
          },
          "operator": "ADD",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "value": 3,
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
            "value": 1,
          },
          "operator": "ADD",
          "rhs": {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "BINARY_EXPRESSION",
              "lhs": {
                "kind": "NUMBER_LITERAL",
                "value": 2,
              },
              "operator": "MULTIPLY",
              "rhs": {
                "kind": "NUMBER_LITERAL",
                "value": 3,
              },
            },
            "operator": "DIVIDE",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "value": 4,
            },
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
              "value": 1,
            },
            "operator": "ADD",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "value": 2,
            },
          },
          "operator": "MULTIPLY",
          "rhs": {
            "kind": "NUMBER_LITERAL",
            "value": 3,
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
                "value": 1,
              },
              "operator": "ADD",
              "rhs": {
                "kind": "NUMBER_LITERAL",
                "value": 2,
              },
            },
            "operator": "MULTIPLY",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "value": 3,
            },
          },
          "operator": "ADD",
          "rhs": {
            "kind": "BINARY_EXPRESSION",
            "lhs": {
              "kind": "NUMBER_LITERAL",
              "value": 4,
            },
            "operator": "ADD",
            "rhs": {
              "kind": "NUMBER_LITERAL",
              "value": 5,
            },
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
          },
          "kind": "RANGE",
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 1,
              "row": 1,
            },
            "name": "A1",
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
          },
          "kind": "RANGE",
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 1,
              "row": 1,
            },
            "name": "A1",
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
          },
          "kind": "RANGE",
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 1,
              "row": 20,
            },
            "name": "A20",
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
          },
          "kind": "RANGE",
          "start": {
            "kind": "CELL",
            "loc": {
              "col": 27,
              "row": 10,
            },
            "name": "AA10",
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
              "value": 1,
            },
            {
              "kind": "NUMBER_LITERAL",
              "value": 2,
            },
            {
              "kind": "NUMBER_LITERAL",
              "value": 3,
            },
          ],
          "kind": "FUNCTION",
          "name": "SUM",
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
              "value": 1,
            },
            {
              "kind": "CELL",
              "loc": {
                "col": 1,
                "row": 1,
              },
              "name": "A1",
            },
            {
              "end": {
                "kind": "CELL",
                "loc": {
                  "col": 2,
                  "row": 8,
                },
                "name": "B8",
              },
              "kind": "RANGE",
              "start": {
                "kind": "CELL",
                "loc": {
                  "col": 1,
                  "row": 3,
                },
                "name": "A3",
              },
            },
          ],
          "kind": "FUNCTION",
          "name": "SUM",
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
              "value": 1,
            },
            {
              "args": [
                {
                  "kind": "NUMBER_LITERAL",
                  "value": 2,
                },
                {
                  "kind": "NUMBER_LITERAL",
                  "value": 3,
                },
                {
                  "kind": "NUMBER_LITERAL",
                  "value": 4,
                },
              ],
              "kind": "FUNCTION",
              "name": "SUM",
            },
            {
              "kind": "NUMBER_LITERAL",
              "value": 5,
            },
          ],
          "kind": "FUNCTION",
          "name": "SUM",
        }
      `)
    })
  })
})
