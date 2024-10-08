const TAB = 9 // '\t'
const NEWLINE = 10 // '\n'
const LINE_FEED = 13 // '\r'
const SPACE = 32 // ' '
const EXCLAMATION = 33 // !
const DOUBLE_QUOTE = 34 // "
const DOLLAR = 36 // $
const OPEN_PAREN = 40 // (
const CLOSE_PAREN = 41 // )
const ASTERISK = 42 // *
const PLUS = 43 // +
const COMMA = 44 // ,
const MINUS = 45 // -
const POINT = 46 // .
const FORWARD_SLASH = 47 // /
const ZERO = 48 // 0
const NINE = 57 // 9
const COLON = 58 // :
const ANGLE_LEFT = 60 // <
const EQUALS = 61 // =
const ANGLE_RIGHT = 62 // >
const UPPER_A = 65 // A
const UPPER_Z = 90 // Z
const CARET = 94 // ^
const UNDERSCORE = 95 // _
const LOWER_A = 97 // a
const LOWER_Z = 122 // z

type Span = {
  start: number
  end: number
}

export enum TokenKind {
  IDENTIFIER = 'IDENTIFIER',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  STRING_LITERAL = 'STRING_LITERAL',
  COMMA = 'COMMA',
  COLON = 'COLON',
  DOLLAR = 'DOLLAR',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
  ASTERISK = 'ASTERISK',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  DIVIDE = 'DIVIDE',
  EXPONENT = 'EXPONENT',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_EQUALS = 'LESS_THAN_EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  EQUALS = 'EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_EQUALS = 'GREATER_THAN_EQUALS',
  UNKNOWN = 'UNKNOWN',
}

export type Token = (
  | { kind: TokenKind.IDENTIFIER; value: string }
  | { kind: TokenKind.NUMBER_LITERAL; value: number }
  | { kind: TokenKind.STRING_LITERAL; value: string }
  | { kind: TokenKind.COMMA }
  | { kind: TokenKind.COLON }
  | { kind: TokenKind.DOLLAR }
  | { kind: TokenKind.OPEN_PAREN }
  | { kind: TokenKind.CLOSE_PAREN }
  | { kind: TokenKind.ASTERISK }
  | { kind: TokenKind.PLUS }
  | { kind: TokenKind.MINUS }
  | { kind: TokenKind.DIVIDE }
  | { kind: TokenKind.EXPONENT }
  | { kind: TokenKind.LESS_THAN }
  | { kind: TokenKind.NOT_EQUALS }
  | { kind: TokenKind.LESS_THAN_EQUALS }
  | { kind: TokenKind.EQUALS }
  | { kind: TokenKind.GREATER_THAN }
  | { kind: TokenKind.GREATER_THAN_EQUALS }
  | { kind: TokenKind.UNKNOWN }
) & { raw: string; span: Span }

export function tokenize(input: string): Token[] {
  let tokens: Token[] = []
  let eol = input.length

  for (let idx = 0; idx < input.length; idx++) {
    let char = input.charCodeAt(idx)

    // Skip whitespace
    if (char === SPACE || char === TAB || char === NEWLINE || char === LINE_FEED) {
      continue
    }

    // String literal
    if (char === DOUBLE_QUOTE) {
      idx++ // Skip the opening quote

      let start = idx
      while (input.charCodeAt(idx) !== DOUBLE_QUOTE && idx < eol) {
        idx++
      }
      let end = idx

      tokens.push({
        kind: TokenKind.STRING_LITERAL,
        value: input.slice(start, end),
        raw: input.slice(start - 1, end + 1),
        span: { start: start - 1, end: end + 1 },
      })
      continue
    }

    // Number literal
    if (char >= ZERO && char <= NINE) {
      let start = idx
      do {
        char = input.charCodeAt(++idx)
      } while (((char >= ZERO && char <= NINE) || char === POINT) && idx < eol)
      let end = idx--

      tokens.push({
        kind: TokenKind.NUMBER_LITERAL,
        value: Number(input.slice(start, end)),
        raw: input.slice(start, end),
        span: { start, end },
      })
      continue
    }

    // Math operators
    if (char === CARET) {
      tokens.push({
        kind: TokenKind.EXPONENT,
        raw: '^',
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    if (char === ASTERISK) {
      tokens.push({
        kind: TokenKind.ASTERISK,
        raw: '*',
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    if (char === FORWARD_SLASH) {
      tokens.push({
        kind: TokenKind.DIVIDE,
        raw: '/',
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    if (char === PLUS) {
      tokens.push({ kind: TokenKind.PLUS, raw: '+', span: { start: idx, end: idx + 1 } })
      continue
    }

    if (char === MINUS) {
      tokens.push({ kind: TokenKind.MINUS, raw: '-', span: { start: idx, end: idx + 1 } })
      continue
    }

    // Comparison operators
    if (char === ANGLE_LEFT) {
      let next = input.charCodeAt(idx + 1)
      if (next === EQUALS) {
        tokens.push({
          kind: TokenKind.LESS_THAN_EQUALS,
          raw: '<=',
          span: { start: idx, end: idx + 2 },
        })
        idx++
      } else {
        tokens.push({
          kind: TokenKind.LESS_THAN,
          raw: '<',
          span: { start: idx, end: idx + 1 },
        })
      }
      continue
    }

    if (char === EXCLAMATION) {
      let next = input.charCodeAt(idx + 1)
      if (next === EQUALS) {
        tokens.push({
          kind: TokenKind.NOT_EQUALS,
          raw: '!=',
          span: { start: idx, end: idx + 2 },
        })
        idx++
      } else {
        tokens.push({
          kind: TokenKind.UNKNOWN,
          raw: '!',
          span: { start: idx, end: idx + 1 },
        })
      }
      continue
    }

    if (char === EQUALS) {
      let next = input.charCodeAt(idx + 1)
      if (next === EQUALS) {
        tokens.push({
          kind: TokenKind.EQUALS,
          raw: '==',
          span: { start: idx, end: idx + 2 },
        })
        idx++
      } else {
        tokens.push({
          kind: TokenKind.UNKNOWN,
          raw: '=',
          span: { start: idx, end: idx + 1 },
        })
      }
      continue
    }

    if (char === ANGLE_RIGHT) {
      let next = input.charCodeAt(idx + 1)
      if (next === EQUALS) {
        tokens.push({
          kind: TokenKind.GREATER_THAN_EQUALS,
          raw: '>=',
          span: { start: idx, end: idx + 2 },
        })
        idx++
      } else {
        tokens.push({
          kind: TokenKind.GREATER_THAN,
          raw: '>',
          span: { start: idx, end: idx + 1 },
        })
      }
      continue
    }

    // Identifier
    if ((char >= UPPER_A && char <= UPPER_Z) || (char >= LOWER_A && char <= LOWER_Z)) {
      let start = idx
      do {
        char = input.charCodeAt(++idx)
      } while (
        ((char >= UPPER_A && char <= UPPER_Z) ||
          (char >= LOWER_A && char <= LOWER_Z) ||
          (char >= ZERO && char <= NINE) ||
          char === UNDERSCORE) &&
        idx < eol
      )
      let end = idx--

      tokens.push({
        kind: TokenKind.IDENTIFIER,
        value: input.slice(start, end).toUpperCase(),
        raw: input.slice(start, end),
        span: { start, end },
      })
      continue
    }

    // Dollar
    if (char === DOLLAR) {
      tokens.push({
        kind: TokenKind.DOLLAR,
        raw: '$',
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    // Colon
    if (char === COLON) {
      tokens.push({ kind: TokenKind.COLON, raw: ':', span: { start: idx, end: idx + 1 } })
      continue
    }

    // Comma
    if (char === COMMA) {
      tokens.push({ kind: TokenKind.COMMA, raw: ',', span: { start: idx, end: idx + 1 } })
      continue
    }

    // Open paren
    if (char === OPEN_PAREN) {
      tokens.push({
        kind: TokenKind.OPEN_PAREN,
        raw: '(',
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    // Close paren
    if (char === CLOSE_PAREN) {
      tokens.push({
        kind: TokenKind.CLOSE_PAREN,
        raw: ')',
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    // Unknown token
    tokens.push({
      kind: TokenKind.UNKNOWN,
      raw: input[idx] as string,
      span: { start: idx, end: idx + 1 },
    })
  }

  return tokens
}

export function printTokens(tokens: Token[]): string {
  let last = 0
  let out = ''

  for (let token of tokens) {
    let spaces = token.span.start - last
    out += ' '.repeat(spaces)
    last = token.span.end

    if (token.kind === TokenKind.IDENTIFIER) {
      out += token.value
    } else {
      out += token.raw
    }
  }

  return out
}
