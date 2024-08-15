import { describe, expect, it } from 'vitest'
import { tokenize } from './tokenizer'

const json = String.raw

describe('number literal', () => {
  it('should tokenize a number literal (unsigned integer)', () => {
    expect(tokenize('123')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "NUMBER",
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
        },
        {
          "kind": "NUMBER",
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
        },
        {
          "kind": "NUMBER",
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
    expect(tokenize('SUM(1, A1, A8:B4)')).toMatchInlineSnapshot(json`
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

describe('math operators', () => {
  it('should tokenize a function call with cell references, ranges and literals', () => {
    expect(tokenize('1 + 2 * 3 - 4 / 2')).toMatchInlineSnapshot(json`
      [
        {
          "kind": "NUMBER",
          "value": 1,
        },
        {
          "kind": "PLUS",
        },
        {
          "kind": "NUMBER",
          "value": 2,
        },
        {
          "kind": "ASTERISK",
        },
        {
          "kind": "NUMBER",
          "value": 3,
        },
        {
          "kind": "MINUS",
        },
        {
          "kind": "NUMBER",
          "value": 4,
        },
        {
          "kind": "FORWARD_SLASH",
        },
        {
          "kind": "NUMBER",
          "value": 2,
        },
      ]
    `)
  })
})
