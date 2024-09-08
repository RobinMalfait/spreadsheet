import { describe, expect, it } from 'vitest'
import { parse } from '~/domain/signature/parser'
import { tokenize } from '~/domain/signature/tokenizer'

const json = String.raw

it('should parse a simple signature expression', () => {
  expect(parse(tokenize('FOO()'))).toMatchInlineSnapshot(json`
    {
      "args": [],
      "description": [Function],
      "internal": false,
      "name": "FOO",
      "tags": [],
    }
  `)
})

it('should parse a function with a required argument', () => {
  expect(parse(tokenize('ABS(x: NUMBER)'))).toMatchInlineSnapshot(json`
    {
      "args": [
        {
          "name": "x",
          "optional": false,
          "types": [
            "NUMBER",
          ],
          "variadic": false,
        },
      ],
      "description": [Function],
      "internal": false,
      "name": "ABS",
      "tags": [],
    }
  `)
})

it('should parse a function with an optional argument', () => {
  expect(parse(tokenize('ABS(x?: NUMBER)'))).toMatchInlineSnapshot(json`
    {
      "args": [
        {
          "name": "x",
          "optional": true,
          "types": [
            "NUMBER",
          ],
          "variadic": false,
        },
      ],
      "description": [Function],
      "internal": false,
      "name": "ABS",
      "tags": [],
    }
  `)
})

it('should parse a function with a variadic argument', () => {
  expect(parse(tokenize('SUM(...values: NUMBER)'))).toMatchInlineSnapshot(json`
    {
      "args": [
        {
          "name": "values",
          "optional": false,
          "types": [
            "NUMBER",
          ],
          "variadic": true,
        },
      ],
      "description": [Function],
      "internal": false,
      "name": "SUM",
      "tags": [],
    }
  `)
})

it('should parse a function with an optional variadic argument', () => {
  expect(parse(tokenize('SUM(...values?: NUMBER)'))).toMatchInlineSnapshot(json`
    {
      "args": [
        {
          "name": "values",
          "optional": true,
          "types": [
            "NUMBER",
          ],
          "variadic": true,
        },
      ],
      "description": [Function],
      "internal": false,
      "name": "SUM",
      "tags": [],
    }
  `)
})

it('should parse a function that accepts multiple types', () => {
  expect(parse(tokenize('FOO(x: NUMBER | STRING)'))).toMatchInlineSnapshot(json`
    {
      "args": [
        {
          "name": "x",
          "optional": false,
          "types": [
            "NUMBER",
            "STRING",
          ],
          "variadic": false,
        },
      ],
      "description": [Function],
      "internal": false,
      "name": "FOO",
      "tags": [],
    }
  `)
})

it('should parse a function that accepts multiple types (3)', () => {
  expect(parse(tokenize('FOO(x: NUMBER | STRING | BOOLEAN)'))).toMatchInlineSnapshot(json`
    {
      "args": [
        {
          "name": "x",
          "optional": false,
          "types": [
            "NUMBER",
            "STRING",
            "BOOLEAN",
          ],
          "variadic": false,
        },
      ],
      "description": [Function],
      "internal": false,
      "name": "FOO",
      "tags": [],
    }
  `)
})

it('should parse a function that accepts multiple arguments, with multiple types', () => {
  expect(
    parse(tokenize('FOO(x: STRING, y: NUMBER | BOOLEAN, z: NUMBER | STRING | BOOLEAN)')),
  ).toMatchInlineSnapshot(json`
    {
      "args": [
        {
          "name": "x",
          "optional": false,
          "types": [
            "STRING",
          ],
          "variadic": false,
        },
        {
          "name": "y",
          "optional": false,
          "types": [
            "NUMBER",
            "BOOLEAN",
          ],
          "variadic": false,
        },
        {
          "name": "z",
          "optional": false,
          "types": [
            "NUMBER",
            "STRING",
            "BOOLEAN",
          ],
          "variadic": false,
        },
      ],
      "description": [Function],
      "internal": false,
      "name": "FOO",
      "tags": [],
    }
  `)
})

describe('at-tags', () => {
  it('should parse an at-tag', () => {
    expect(
      parse(
        tokenize(`
          @description The absolute value of a number
          @param x The number to get the absolute value of
          @example ABS(123)
          @example ABS(-123)

          ABS(x: NUMBER)
        `),
      ),
    ).toMatchInlineSnapshot(json`
      {
        "args": [
          {
            "name": "x",
            "optional": false,
            "types": [
              "NUMBER",
            ],
            "variadic": false,
          },
        ],
        "description": [Function],
        "internal": false,
        "name": "ABS",
        "tags": [
          {
            "kind": "description",
            "value": "The absolute value of a number",
          },
          {
            "kind": "param",
            "name": "x",
            "value": "The number to get the absolute value of",
          },
          {
            "kind": "example",
            "value": "ABS(123)",
          },
          {
            "kind": "example",
            "value": "ABS(-123)",
          },
        ],
      }
    `)
  })
})

describe('error handling', () => {
  it('should throw when the name is missing', () => {
    expect(() => parse(tokenize('()'))).toThrowError('Expected a function name')
  })

  it('should throw when open parenthesis is missing', () => {
    expect(() => parse(tokenize('FOO'))).toThrowError('Expected an open parenthesis')
  })

  it('should throw when open parenthesis is missing (but closing is present)', () => {
    expect(() => parse(tokenize('FOO)'))).toThrowError('Expected an open parenthesis')
  })

  it('should throw when closing parenthesis is missing', () => {
    expect(() => parse(tokenize('FOO('))).toThrowError('Expected a close parenthesis')
  })

  it('should throw when type is missing', () => {
    expect(() => parse(tokenize('FOO(x)'))).toThrowError(
      'Expected a colon and a type, e.g.: `: NUMBER`',
    )
  })

  it('should throw when the variable name is missing', () => {
    expect(() => parse(tokenize('FOO(: NUMBER)'))).toThrowError(
      'Expected a variable name',
    )
  })

  it('should throw when type is missing (but colon is present)', () => {
    expect(() => parse(tokenize('FOO(x:)'))).toThrowError(
      'Expected a type, e.g.: `NUMBER`',
    )
  })

  it('should throw when `|` is missing between multiple types', () => {
    expect(() => parse(tokenize('FOO(x: NUMBER STRING)'))).toThrowError(
      'Expected a `|`, `,` or `)`, got `IDENTIFIER(STRING)`',
    )
  })

  it('should throw when next type is missing after the `|`', () => {
    expect(() => parse(tokenize('FOO(x: NUMBER |)'))).toThrowError(
      'Expected a type after the `|`',
    )
  })

  it('should throw when `,` is missing between multiple arguments', () => {
    expect(() => parse(tokenize('FOO(x: NUMBER y: STRING)'))).toThrowError(
      'Expected a `|`, `,` or `)`, got `IDENTIFIER(y)`',
    )
  })
})
