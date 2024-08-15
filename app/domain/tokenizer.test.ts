import { describe, expect, it } from 'vitest'
import { tokenize } from './tokenizer'

const json = String.raw

describe('number literal', () => {
  it('should tokenize a number literal (unsigned integer)', () => {
    expect(tokenize('123')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "NUMBER",
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
          "span": {
            "end": 1,
            "start": 0,
          },
        },
        {
          "kind": "NUMBER",
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
          "kind": "NUMBER",
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
          "span": {
            "end": 1,
            "start": 0,
          },
        },
        {
          "kind": "NUMBER",
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
          "kind": "STRING",
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
          "span": {
            "end": 3,
            "start": 0,
          },
          "value": "SUM",
        },
        {
          "kind": "OPEN_PAREN",
          "span": {
            "end": 4,
            "start": 3,
          },
        },
        {
          "kind": "NUMBER",
          "span": {
            "end": 5,
            "start": 4,
          },
          "value": 1,
        },
        {
          "kind": "CLOSE_PAREN",
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
          "span": {
            "end": 3,
            "start": 0,
          },
          "value": "SUM",
        },
        {
          "kind": "OPEN_PAREN",
          "span": {
            "end": 4,
            "start": 3,
          },
        },
        {
          "kind": "NUMBER",
          "span": {
            "end": 5,
            "start": 4,
          },
          "value": 1,
        },
        {
          "kind": "COMMA",
          "span": {
            "end": 6,
            "start": 5,
          },
        },
        {
          "kind": "IDENTIFIER",
          "span": {
            "end": 9,
            "start": 7,
          },
          "value": "A1",
        },
        {
          "kind": "COMMA",
          "span": {
            "end": 10,
            "start": 9,
          },
        },
        {
          "kind": "IDENTIFIER",
          "span": {
            "end": 13,
            "start": 11,
          },
          "value": "A8",
        },
        {
          "kind": "COLON",
          "span": {
            "end": 14,
            "start": 13,
          },
        },
        {
          "kind": "IDENTIFIER",
          "span": {
            "end": 16,
            "start": 14,
          },
          "value": "B4",
        },
        {
          "kind": "CLOSE_PAREN",
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
          "kind": "NUMBER",
          "span": {
            "end": 1,
            "start": 0,
          },
          "value": 1,
        },
        {
          "kind": "PLUS",
          "span": {
            "end": 3,
            "start": 2,
          },
        },
        {
          "kind": "NUMBER",
          "span": {
            "end": 5,
            "start": 4,
          },
          "value": 2,
        },
        {
          "kind": "ASTERISK",
          "span": {
            "end": 7,
            "start": 6,
          },
        },
        {
          "kind": "NUMBER",
          "span": {
            "end": 9,
            "start": 8,
          },
          "value": 3,
        },
        {
          "kind": "MINUS",
          "span": {
            "end": 11,
            "start": 10,
          },
        },
        {
          "kind": "NUMBER",
          "span": {
            "end": 13,
            "start": 12,
          },
          "value": 4,
        },
        {
          "kind": "FORWARD_SLASH",
          "span": {
            "end": 15,
            "start": 14,
          },
        },
        {
          "kind": "NUMBER",
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
