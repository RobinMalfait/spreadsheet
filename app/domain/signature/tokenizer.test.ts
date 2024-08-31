import { expect, it } from 'vitest'
import { tokenize } from '~/domain/signature/tokenizer'

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

it('should tokenize a function without arguments', () => {
  expect(tokenize('PI()')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "IDENTIFIER",
        "raw": "PI",
        "span": {
          "end": 2,
          "start": 0,
        },
        "value": "PI",
      },
      {
        "kind": "OPEN_PAREN",
        "raw": "(",
        "span": {
          "end": 3,
          "start": 2,
        },
      },
      {
        "kind": "CLOSE_PAREN",
        "raw": ")",
        "span": {
          "end": 4,
          "start": 3,
        },
      },
    ]
  `)
})

it('should tokenize a function with a required argument', () => {
  expect(tokenize('ABS(value: NUMBER)')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "IDENTIFIER",
        "raw": "ABS",
        "span": {
          "end": 3,
          "start": 0,
        },
        "value": "ABS",
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
        "kind": "IDENTIFIER",
        "raw": "value",
        "span": {
          "end": 9,
          "start": 4,
        },
        "value": "value",
      },
      {
        "kind": "COLON",
        "raw": ":",
        "span": {
          "end": 10,
          "start": 9,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "NUMBER",
        "span": {
          "end": 17,
          "start": 11,
        },
        "value": "NUMBER",
      },
      {
        "kind": "CLOSE_PAREN",
        "raw": ")",
        "span": {
          "end": 18,
          "start": 17,
        },
      },
    ]
  `)
})

it('should tokenize a function with a required argument that can have multiple types', () => {
  expect(tokenize('FOO(x: NUMBER | STRING)')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "IDENTIFIER",
        "raw": "FOO",
        "span": {
          "end": 3,
          "start": 0,
        },
        "value": "FOO",
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
        "kind": "IDENTIFIER",
        "raw": "x",
        "span": {
          "end": 5,
          "start": 4,
        },
        "value": "x",
      },
      {
        "kind": "COLON",
        "raw": ":",
        "span": {
          "end": 6,
          "start": 5,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "NUMBER",
        "span": {
          "end": 13,
          "start": 7,
        },
        "value": "NUMBER",
      },
      {
        "kind": "OR",
        "raw": "|",
        "span": {
          "end": 15,
          "start": 14,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "STRING",
        "span": {
          "end": 22,
          "start": 16,
        },
        "value": "STRING",
      },
      {
        "kind": "CLOSE_PAREN",
        "raw": ")",
        "span": {
          "end": 23,
          "start": 22,
        },
      },
    ]
  `)
})

it('should tokenize a function with an optional argument', () => {
  expect(tokenize('ABS(value?: NUMBER)')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "IDENTIFIER",
        "raw": "ABS",
        "span": {
          "end": 3,
          "start": 0,
        },
        "value": "ABS",
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
        "kind": "IDENTIFIER",
        "raw": "value",
        "span": {
          "end": 9,
          "start": 4,
        },
        "value": "value",
      },
      {
        "kind": "QUESTION_MARK",
        "raw": "?",
        "span": {
          "end": 10,
          "start": 9,
        },
      },
      {
        "kind": "COLON",
        "raw": ":",
        "span": {
          "end": 11,
          "start": 10,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "NUMBER",
        "span": {
          "end": 18,
          "start": 12,
        },
        "value": "NUMBER",
      },
      {
        "kind": "CLOSE_PAREN",
        "raw": ")",
        "span": {
          "end": 19,
          "start": 18,
        },
      },
    ]
  `)
})

it('should tokenize a function with two required arguments', () => {
  expect(tokenize('IMUL(x: NUMBER, y: NUMBER)')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "IDENTIFIER",
        "raw": "IMUL",
        "span": {
          "end": 4,
          "start": 0,
        },
        "value": "IMUL",
      },
      {
        "kind": "OPEN_PAREN",
        "raw": "(",
        "span": {
          "end": 5,
          "start": 4,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "x",
        "span": {
          "end": 6,
          "start": 5,
        },
        "value": "x",
      },
      {
        "kind": "COLON",
        "raw": ":",
        "span": {
          "end": 7,
          "start": 6,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "NUMBER",
        "span": {
          "end": 14,
          "start": 8,
        },
        "value": "NUMBER",
      },
      {
        "kind": "COMMA",
        "raw": ",",
        "span": {
          "end": 15,
          "start": 14,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "y",
        "span": {
          "end": 17,
          "start": 16,
        },
        "value": "y",
      },
      {
        "kind": "COLON",
        "raw": ":",
        "span": {
          "end": 18,
          "start": 17,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "NUMBER",
        "span": {
          "end": 25,
          "start": 19,
        },
        "value": "NUMBER",
      },
      {
        "kind": "CLOSE_PAREN",
        "raw": ")",
        "span": {
          "end": 26,
          "start": 25,
        },
      },
    ]
  `)
})

it('should tokenize a function with two optional arguments', () => {
  expect(tokenize('FOO(x?: NUMBER, y?: NUMBER)')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "IDENTIFIER",
        "raw": "FOO",
        "span": {
          "end": 3,
          "start": 0,
        },
        "value": "FOO",
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
        "kind": "IDENTIFIER",
        "raw": "x",
        "span": {
          "end": 5,
          "start": 4,
        },
        "value": "x",
      },
      {
        "kind": "QUESTION_MARK",
        "raw": "?",
        "span": {
          "end": 6,
          "start": 5,
        },
      },
      {
        "kind": "COLON",
        "raw": ":",
        "span": {
          "end": 7,
          "start": 6,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "NUMBER",
        "span": {
          "end": 14,
          "start": 8,
        },
        "value": "NUMBER",
      },
      {
        "kind": "COMMA",
        "raw": ",",
        "span": {
          "end": 15,
          "start": 14,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "y",
        "span": {
          "end": 17,
          "start": 16,
        },
        "value": "y",
      },
      {
        "kind": "QUESTION_MARK",
        "raw": "?",
        "span": {
          "end": 18,
          "start": 17,
        },
      },
      {
        "kind": "COLON",
        "raw": ":",
        "span": {
          "end": 19,
          "start": 18,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "NUMBER",
        "span": {
          "end": 26,
          "start": 20,
        },
        "value": "NUMBER",
      },
      {
        "kind": "CLOSE_PAREN",
        "raw": ")",
        "span": {
          "end": 27,
          "start": 26,
        },
      },
    ]
  `)
})

it('should tokenize a function with variadic arguments', () => {
  expect(tokenize('FOO(...values: NUMBER)')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "IDENTIFIER",
        "raw": "FOO",
        "span": {
          "end": 3,
          "start": 0,
        },
        "value": "FOO",
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
        "kind": "VARIADIC_MARKER",
        "raw": "...",
        "span": {
          "end": 7,
          "start": 4,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "values",
        "span": {
          "end": 13,
          "start": 7,
        },
        "value": "values",
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
        "raw": "NUMBER",
        "span": {
          "end": 21,
          "start": 15,
        },
        "value": "NUMBER",
      },
      {
        "kind": "CLOSE_PAREN",
        "raw": ")",
        "span": {
          "end": 22,
          "start": 21,
        },
      },
    ]
  `)
})

it('should tokenize the `@description`', () => {
  expect(
    tokenize('@description Now this is a story, all about how'),
  ).toMatchInlineSnapshot(json`
    [
      {
        "kind": "AT",
        "raw": "@",
        "span": {
          "end": 1,
          "start": 0,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "description",
        "span": {
          "end": 12,
          "start": 1,
        },
        "value": "description",
      },
      {
        "kind": "STRING",
        "raw": "Now this is a story, all about how",
        "span": {
          "end": 47,
          "start": 13,
        },
        "value": "Now this is a story, all about how",
      },
    ]
  `)
})

it('should tokenize the `@param`', () => {
  expect(tokenize('@param x The number to work with')).toMatchInlineSnapshot(json`
    [
      {
        "kind": "AT",
        "raw": "@",
        "span": {
          "end": 1,
          "start": 0,
        },
      },
      {
        "kind": "IDENTIFIER",
        "raw": "param",
        "span": {
          "end": 6,
          "start": 1,
        },
        "value": "param",
      },
      {
        "kind": "IDENTIFIER",
        "raw": "x",
        "span": {
          "end": 8,
          "start": 7,
        },
        "value": "x",
      },
      {
        "kind": "STRING",
        "raw": "The number to work with",
        "span": {
          "end": 32,
          "start": 9,
        },
        "value": "The number to work with",
      },
    ]
  `)
})
