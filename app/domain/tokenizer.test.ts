import { describe, expect, it } from 'vitest'
import { tokenize } from '~/domain/tokenizer'

const json = String.raw

it('should tokenize an empty string', () => {
  expect(tokenize('')).toMatchInlineSnapshot(json`[]`)
})

it('should tokenize unknown characters', () => {
  expect(tokenize('…')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "UNKNOWN",
        "raw": "…",
        "span": {
          "end": 1,
          "start": 0,
        },
      },
    ]
  `)
})

describe('number literal', () => {
  it('should tokenize a number literal (unsigned integer)', () => {
    expect(tokenize('123')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "NUMBER_LITERAL",
          "raw": "123",
          "span": {
            "end": 3,
            "start": 0,
          },
          "value": 123,
        },
      ]
    `)
  })

  it('should tokenize a number literal (signed integer)', () => {
    expect(tokenize('-123')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "MINUS",
          "raw": "-",
          "span": {
            "end": 1,
            "start": 0,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "123",
          "span": {
            "end": 4,
            "start": 1,
          },
          "value": 123,
        },
      ]
    `)
  })

  it('should tokenize a number literal (unsigned float)', () => {
    expect(tokenize('123.456')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "NUMBER_LITERAL",
          "raw": "123.456",
          "span": {
            "end": 7,
            "start": 0,
          },
          "value": 123.456,
        },
      ]
    `)
  })

  it('should tokenize a number literal (signed float)', () => {
    expect(tokenize('-123.456')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "MINUS",
          "raw": "-",
          "span": {
            "end": 1,
            "start": 0,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "123.456",
          "span": {
            "end": 8,
            "start": 1,
          },
          "value": 123.456,
        },
      ]
    `)
  })
})

describe('string literal', () => {
  it('should tokenize a string literal', () => {
    expect(tokenize('"hello world"')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "STRING_LITERAL",
          "raw": ""hello world"",
          "span": {
            "end": 13,
            "start": 0,
          },
          "value": "hello world",
        },
      ]
    `)
  })

  it('should tokenize a string literal that is incomplete', () => {
    expect(tokenize('"hello world')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "STRING_LITERAL",
          "raw": ""hello world",
          "span": {
            "end": 13,
            "start": 0,
          },
          "value": "hello world",
        },
      ]
    `)
  })
})

describe('function call', () => {
  it('should tokenize a function call', () => {
    expect(tokenize('SUM(1)')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "IDENTIFIER",
          "raw": "SUM",
          "span": {
            "end": 3,
            "start": 0,
          },
          "value": "SUM",
        },
        {
          "kind": "OPEN_PAREN",
          "raw": "(",
          "span": {
            "end": 4,
            "start": 3,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "1",
          "span": {
            "end": 5,
            "start": 4,
          },
          "value": 1,
        },
        {
          "kind": "CLOSE_PAREN",
          "raw": ")",
          "span": {
            "end": 6,
            "start": 5,
          },
        },
      ]
    `)
  })

  it('should tokenize a function call with cell references, ranges and literals', () => {
    expect(tokenize('SUM(1, A1, A8:B4)')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "IDENTIFIER",
          "raw": "SUM",
          "span": {
            "end": 3,
            "start": 0,
          },
          "value": "SUM",
        },
        {
          "kind": "OPEN_PAREN",
          "raw": "(",
          "span": {
            "end": 4,
            "start": 3,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "1",
          "span": {
            "end": 5,
            "start": 4,
          },
          "value": 1,
        },
        {
          "kind": "COMMA",
          "raw": ",",
          "span": {
            "end": 6,
            "start": 5,
          },
        },
        {
          "kind": "IDENTIFIER",
          "raw": "A1",
          "span": {
            "end": 9,
            "start": 7,
          },
          "value": "A1",
        },
        {
          "kind": "COMMA",
          "raw": ",",
          "span": {
            "end": 10,
            "start": 9,
          },
        },
        {
          "kind": "IDENTIFIER",
          "raw": "A8",
          "span": {
            "end": 13,
            "start": 11,
          },
          "value": "A8",
        },
        {
          "kind": "COLON",
          "raw": ":",
          "span": {
            "end": 14,
            "start": 13,
          },
        },
        {
          "kind": "IDENTIFIER",
          "raw": "B4",
          "span": {
            "end": 16,
            "start": 14,
          },
          "value": "B4",
        },
        {
          "kind": "CLOSE_PAREN",
          "raw": ")",
          "span": {
            "end": 17,
            "start": 16,
          },
        },
      ]
    `)
  })
})

describe('math operators', () => {
  it('should tokenize a function call with cell references, ranges and literals', () => {
    expect(tokenize('1 + 2 * 3 - 4 / 2')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "NUMBER_LITERAL",
          "raw": "1",
          "span": {
            "end": 1,
            "start": 0,
          },
          "value": 1,
        },
        {
          "kind": "PLUS",
          "raw": "+",
          "span": {
            "end": 3,
            "start": 2,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "2",
          "span": {
            "end": 5,
            "start": 4,
          },
          "value": 2,
        },
        {
          "kind": "ASTERISK",
          "raw": "*",
          "span": {
            "end": 7,
            "start": 6,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "3",
          "span": {
            "end": 9,
            "start": 8,
          },
          "value": 3,
        },
        {
          "kind": "MINUS",
          "raw": "-",
          "span": {
            "end": 11,
            "start": 10,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "4",
          "span": {
            "end": 13,
            "start": 12,
          },
          "value": 4,
        },
        {
          "kind": "DIVIDE",
          "raw": "/",
          "span": {
            "end": 15,
            "start": 14,
          },
        },
        {
          "kind": "NUMBER_LITERAL",
          "raw": "2",
          "span": {
            "end": 17,
            "start": 16,
          },
          "value": 2,
        },
      ]
    `)
  })
})

describe('span', () => {
  it('should have the correct span for a token', () => {
    let input = '1 + 2 * 3 - 40 / B1 + SUM(A1:B2, PI())'
    let tokens = tokenize(input)

    for (let token of tokens) {
      expect(input.slice(token.span.start, token.span.end)).toBe(token.raw)
    }
  })
})
