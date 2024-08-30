const TAB = 9 // '\t'
const NEWLINE = 10 // '\n'
const LINE_FEED = 13 // '\r'
const SPACE = 32 // ' '
const OPEN_PAREN = 40 // (
const CLOSE_PAREN = 41 // )
const COMMA = 44 // ,
const POINT = 46 // .
const ZERO = 48 // 0
const NINE = 57 // 9
const COLON = 58 // :
const QUESTION_MARK = 63 // ?
const UPPER_A = 65 // A
const UPPER_Z = 90 // Z
const UNDERSCORE = 95 // _
const LOWER_A = 97 // a
const LOWER_Z = 122 // z
const OR = 124 // |

type Span = {
  start: number
  end: number
}

export enum TokenKind {
  IDENTIFIER = 'IDENTIFIER',
  VARIADIC_MARKER = 'VARIADIC_MARKER',
  OR = 'OR',
  QUESTION_MARK = 'QUESTION_MARK',
  COLON = 'COLON',
  COMMA = 'COMMA',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
  UNKNOWN = 'UNKNOWN',
}

export type Token = (
  | { kind: TokenKind.IDENTIFIER; value: string }
  | { kind: TokenKind.VARIADIC_MARKER }
  | { kind: TokenKind.OR }
  | { kind: TokenKind.QUESTION_MARK }
  | { kind: TokenKind.COLON }
  | { kind: TokenKind.COMMA }
  | { kind: TokenKind.OPEN_PAREN }
  | { kind: TokenKind.CLOSE_PAREN }
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
        value: input.slice(start, end),
        raw: input.slice(start, end),
        span: { start, end },
      })
      continue
    }

    // Variadic marker
    if (
      char === POINT &&
      input.charCodeAt(idx + 1) === POINT &&
      input.charCodeAt(idx + 2) === POINT
    ) {
      tokens.push({
        kind: TokenKind.VARIADIC_MARKER,
        raw: '...',
        span: { start: idx, end: idx + 3 },
      })
      idx += 2
      continue
    }

    // Or operator
    if (char === OR) {
      tokens.push({ kind: TokenKind.OR, raw: '|', span: { start: idx, end: idx + 1 } })
      continue
    }

    // Question mark
    if (char === QUESTION_MARK) {
      tokens.push({
        kind: TokenKind.QUESTION_MARK,
        raw: '?',
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
