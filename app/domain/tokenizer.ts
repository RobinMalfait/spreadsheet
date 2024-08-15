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
  | { kind: TokenKind.IDENTIFIER; value: string }
  | { kind: TokenKind.NUMBER_LITERAL; value: number }
  | { kind: TokenKind.STRING_LITERAL; value: string }
  | { kind: TokenKind.COMMA }
  | { kind: TokenKind.COLON }
  | { kind: TokenKind.OPEN_PAREN }
  | { kind: TokenKind.CLOSE_PAREN }
  | { kind: TokenKind.ASTERISK }
  | { kind: TokenKind.PLUS }
  | { kind: TokenKind.MINUS }
  | { kind: TokenKind.FORWARD_SLASH }
  | { kind: TokenKind.ANGLE_LEFT }
  | { kind: TokenKind.EQUALS }
  | { kind: TokenKind.ANGLE_RIGHT }

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
      })
      continue
    }

    // Math operators
    if (char === ASTERISK) {
      tokens.push({ kind: TokenKind.ASTERISK })
      continue
    }

    if (char === PLUS) {
      tokens.push({ kind: TokenKind.PLUS })
      continue
    }

    if (char === MINUS) {
      tokens.push({ kind: TokenKind.MINUS })
      continue
    }

    if (char === FORWARD_SLASH) {
      tokens.push({ kind: TokenKind.FORWARD_SLASH })
      continue
    }

    if (char === ANGLE_LEFT) {
      tokens.push({ kind: TokenKind.ANGLE_LEFT })
      continue
    }

    if (char === EQUALS) {
      tokens.push({ kind: TokenKind.EQUALS })
      continue
    }

    if (char === ANGLE_RIGHT) {
      tokens.push({ kind: TokenKind.ANGLE_RIGHT })
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
      })
      continue
    }

    // Colon
    if (char === COLON) {
      tokens.push({ kind: TokenKind.COLON })
      continue
    }

    // Comma
    if (char === COMMA) {
      tokens.push({ kind: TokenKind.COMMA })
      continue
    }

    // Open paren
    if (char === OPEN_PAREN) {
      tokens.push({ kind: TokenKind.OPEN_PAREN })
      continue
    }

    // Close paren
    if (char === CLOSE_PAREN) {
      tokens.push({ kind: TokenKind.CLOSE_PAREN })
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
