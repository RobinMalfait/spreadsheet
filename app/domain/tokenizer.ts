const TAB = 9 // '\t'
const NEWLINE = 10 // '\n'
const LINE_FEED = 13 // '\r'
const SPACE = 32 // ' '
const DOUBLE_QUOTE = 34 // "
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
const LOWER_A = 97 // a
const LOWER_Z = 122 // z

type Span = {
  start: number
  end: number
}

export enum TokenKind {
  IDENTIFIER = 'IDENTIFIER',
  NUMBER_LITERAL = 'NUMBER',
  STRING_LITERAL = 'STRING',
  COMMA = 'COMMA',
  COLON = 'COLON',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
  ASTERISK = 'ASTERISK',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  FORWARD_SLASH = 'FORWARD_SLASH',
  ANGLE_LEFT = 'ANGLE_LEFT',
  EQUALS = 'EQUALS',
  ANGLE_RIGHT = 'ANGLE_RIGHT',
}

export type Token =
  | { kind: TokenKind.IDENTIFIER; value: string; span: Span }
  | { kind: TokenKind.NUMBER_LITERAL; value: number; span: Span }
  | { kind: TokenKind.STRING_LITERAL; value: string; span: Span }
  | { kind: TokenKind.COMMA; span: Span }
  | { kind: TokenKind.COLON; span: Span }
  | { kind: TokenKind.OPEN_PAREN; span: Span }
  | { kind: TokenKind.CLOSE_PAREN; span: Span }
  | { kind: TokenKind.ASTERISK; span: Span }
  | { kind: TokenKind.PLUS; span: Span }
  | { kind: TokenKind.MINUS; span: Span }
  | { kind: TokenKind.FORWARD_SLASH; span: Span }
  | { kind: TokenKind.ANGLE_LEFT; span: Span }
  | { kind: TokenKind.EQUALS; span: Span }
  | { kind: TokenKind.ANGLE_RIGHT; span: Span }

export function tokenize(input: string): Token[] {
  let tokens: Token[] = []

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
      do {
        char = input.charCodeAt(++idx)
      } while (char !== DOUBLE_QUOTE)
      let end = idx

      tokens.push({
        kind: TokenKind.STRING_LITERAL,
        value: input.slice(start, end),
        span: { start: start - 1, end: end + 1 },
      })
      continue
    }

    // Number literal
    if (char >= ZERO && char <= NINE) {
      let start = idx
      do {
        char = input.charCodeAt(++idx)
      } while ((char >= ZERO && char <= NINE) || char === POINT)
      let end = idx--

      tokens.push({
        kind: TokenKind.NUMBER_LITERAL,
        value: Number(input.slice(start, end)),
        span: { start, end },
      })
      continue
    }

    // Math operators
    if (char === ASTERISK) {
      tokens.push({
        kind: TokenKind.ASTERISK,
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    if (char === PLUS) {
      tokens.push({ kind: TokenKind.PLUS, span: { start: idx, end: idx + 1 } })
      continue
    }

    if (char === MINUS) {
      tokens.push({ kind: TokenKind.MINUS, span: { start: idx, end: idx + 1 } })
      continue
    }

    if (char === FORWARD_SLASH) {
      tokens.push({ kind: TokenKind.FORWARD_SLASH, span: { start: idx, end: idx + 1 } })
      continue
    }

    if (char === ANGLE_LEFT) {
      tokens.push({ kind: TokenKind.ANGLE_LEFT, span: { start: idx, end: idx + 1 } })
      continue
    }

    if (char === EQUALS) {
      tokens.push({ kind: TokenKind.EQUALS, span: { start: idx, end: idx + 1 } })
      continue
    }

    if (char === ANGLE_RIGHT) {
      tokens.push({ kind: TokenKind.ANGLE_RIGHT, span: { start: idx, end: idx + 1 } })
      continue
    }

    // Identifier
    if ((char >= UPPER_A && char <= UPPER_Z) || (char >= LOWER_A && char <= LOWER_Z)) {
      let start = idx
      do {
        char = input.charCodeAt(++idx)
      } while (
        (char >= UPPER_A && char <= UPPER_Z) ||
        (char >= LOWER_A && char <= LOWER_Z) ||
        (char >= ZERO && char <= NINE)
      )
      let end = idx--

      tokens.push({
        kind: TokenKind.IDENTIFIER,
        value: input.slice(start, end),
        span: { start, end },
      })
      continue
    }

    // Colon
    if (char === COLON) {
      tokens.push({ kind: TokenKind.COLON, span: { start: idx, end: idx + 1 } })
      continue
    }

    // Comma
    if (char === COMMA) {
      tokens.push({ kind: TokenKind.COMMA, span: { start: idx, end: idx + 1 } })
      continue
    }

    // Open paren
    if (char === OPEN_PAREN) {
      tokens.push({ kind: TokenKind.OPEN_PAREN, span: { start: idx, end: idx + 1 } })
      continue
    }

    // Close paren
    if (char === CLOSE_PAREN) {
      tokens.push({ kind: TokenKind.CLOSE_PAREN, span: { start: idx, end: idx + 1 } })
      continue
    }

    throw new Error(`Invalid token: ${input[idx]}`)
  }

  return tokens
}

export function printToken(token: Token) {
  switch (token.kind) {
    case TokenKind.IDENTIFIER:
    case TokenKind.NUMBER_LITERAL:
    case TokenKind.STRING_LITERAL:
      return token.value.toString()
    case TokenKind.COMMA:
      return ','
    case TokenKind.COLON:
      return ':'
    case TokenKind.OPEN_PAREN:
      return '('
    case TokenKind.CLOSE_PAREN:
      return ')'
    case TokenKind.ASTERISK:
      return '*'
    case TokenKind.PLUS:
      return '+'
    case TokenKind.MINUS:
      return '-'
    case TokenKind.FORWARD_SLASH:
      return '/'
    case TokenKind.ANGLE_LEFT:
      return '<'
    case TokenKind.EQUALS:
      return '='
    case TokenKind.ANGLE_RIGHT:
      return '>'
  }
}
