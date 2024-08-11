import { describe, expect, it } from 'vitest'
import { parseColNumber, parseExpression, tokenizeExpression } from './expression'

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

describe('tokenization', () => {
  describe('number literal', () => {
    it('should tokenize a number literal (unsigned integer)', () => {
      expect(tokenizeExpression('123')).toMatchInlineSnapshot(json`
        [
          {
            "kind": "NUMBER",
            "value": 123,
          },
        ]
      `)
    })

    it('should tokenize a number literal (signed integer)', () => {
      expect(tokenizeExpression('-123')).toMatchInlineSnapshot(json`
        [
          {
            "kind": "NUMBER",
            "value": -123,
          },
        ]
      `)
    })

    it('should tokenize a number literal (unsigned float)', () => {
      expect(tokenizeExpression('123.456')).toMatchInlineSnapshot(json`
        [
          {
            "kind": "NUMBER",
            "value": 123.456,
          },
        ]
      `)
    })

    it('should tokenize a number literal (signed float)', () => {
      expect(tokenizeExpression('-123.456')).toMatchInlineSnapshot(json`
        [
          {
            "kind": "NUMBER",
            "value": -123.456,
          },
        ]
      `)
    })
  })

  describe('string literal', () => {
    it('should tokenize a string literal', () => {
      expect(tokenizeExpression('"hello world"')).toMatchInlineSnapshot(json`
        [
          {
            "kind": "STRING",
            "value": "hello world",
          },
        ]
      `)
    })
  })

  describe('function call', () => {
    it('should tokenize a function call', () => {
      expect(tokenizeExpression('SUM(1)')).toMatchInlineSnapshot(json`
        [
          {
            "kind": "IDENTIFIER",
            "value": "SUM",
          },
          {
            "kind": "OPEN_PAREN",
          },
          {
            "kind": "NUMBER",
            "value": 1,
          },
          {
            "kind": "CLOSE_PAREN",
          },
        ]
      `)
    })

    it('should tokenize a function call with cell references, ranges and literals', () => {
      expect(tokenizeExpression('SUM(1, A1, A8:B4)')).toMatchInlineSnapshot(json`
        [
          {
            "kind": "IDENTIFIER",
            "value": "SUM",
          },
          {
            "kind": "OPEN_PAREN",
          },
          {
            "kind": "NUMBER",
            "value": 1,
          },
          {
            "kind": "COMMA",
          },
          {
            "kind": "IDENTIFIER",
            "value": "A1",
          },
          {
            "kind": "COMMA",
          },
          {
            "kind": "IDENTIFIER",
            "value": "A8",
          },
          {
            "kind": "COLON",
          },
          {
            "kind": "IDENTIFIER",
            "value": "B4",
          },
          {
            "kind": "CLOSE_PAREN",
          },
        ]
      `)
    })
  })
})

describe('parsing', () => {
  describe('number literal', () => {
    it('should parse a static number value', () => {
      expect(parseExpression(tokenizeExpression('123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER",
          "value": 123,
        }
      `)
    })

    it('should parse a static negative number value', () => {
      expect(parseExpression(tokenizeExpression('-123'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER",
          "value": -123,
        }
      `)
    })

    it('should parse a static float value', () => {
      expect(parseExpression(tokenizeExpression('123.456'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER",
          "value": 123.456,
        }
      `)
    })

    it('should parse a static negative float value', () => {
      expect(parseExpression(tokenizeExpression('-123.456'))).toMatchInlineSnapshot(json`
        {
          "kind": "NUMBER",
          "value": -123.456,
        }
      `)
    })
  })

  describe('string literal', () => {
    it('should parse a static string value', () => {
      expect(
        parseExpression(tokenizeExpression('"hello world"')),
      ).toMatchInlineSnapshot(json`
        {
          "kind": "STRING",
          "value": "hello world",
        }
      `)
    })
  })

  describe('cell reference', () => {
    it('should parse a cell reference', () => {
      expect(parseExpression(tokenizeExpression('A1'))).toMatchInlineSnapshot(json`
        {
          "kind": "CELL",
          "loc": {
            "col": 1,
            "row": 1,
          },
          "name": "A1",
        }
      `)
      expect(parseExpression(tokenizeExpression('A23'))).toMatchInlineSnapshot(json`
        {
          "kind": "CELL",
          "loc": {
            "col": 1,
            "row": 23,
          },
          "name": "A23",
        }
      `)
      expect(parseExpression(tokenizeExpression('AZ99'))).toMatchInlineSnapshot(json`
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
      expect(parseExpression(tokenizeExpression('A1:B2'))).toMatchInlineSnapshot(json`
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
      expect(parseExpression(tokenizeExpression('A1:B20'))).toMatchInlineSnapshot(json`
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
      expect(parseExpression(tokenizeExpression('A20:B2'))).toMatchInlineSnapshot(json`
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
      expect(parseExpression(tokenizeExpression('AA10:ZZ99'))).toMatchInlineSnapshot(json`
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
      expect(parseExpression(tokenizeExpression('SUM(1, 2, 3)'))).toMatchInlineSnapshot(
        json`
        {
          "args": [
            {
              "kind": "NUMBER",
              "value": 1,
            },
            {
              "kind": "NUMBER",
              "value": 2,
            },
            {
              "kind": "NUMBER",
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
      expect(
        parseExpression(tokenizeExpression('SUM(1, A1, A3:B8)')),
      ).toMatchInlineSnapshot(json`
        {
          "args": [
            {
              "kind": "NUMBER",
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
        parseExpression(tokenizeExpression('SUM(1, SUM(2, 3, 4), 5)')),
      ).toMatchInlineSnapshot(json`
        {
          "args": [
            {
              "kind": "NUMBER",
              "value": 1,
            },
            {
              "args": [
                {
                  "kind": "NUMBER",
                  "value": 2,
                },
                {
                  "kind": "NUMBER",
                  "value": 3,
                },
                {
                  "kind": "NUMBER",
                  "value": 4,
                },
              ],
              "kind": "FUNCTION",
              "name": "SUM",
            },
            {
              "kind": "NUMBER",
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
