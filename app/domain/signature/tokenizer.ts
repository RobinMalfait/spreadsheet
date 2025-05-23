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
const AT = 64 // @
const UPPER_A = 65 // A
const UPPER_Z = 90 // Z
const CLOSE_BRACKET = 93 // ]
const UNDERSCORE = 95 // _
const OPEN_BRACKET = 91 // [
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
  STRING = 'STRING',
  OR = 'OR',
  AT = 'AT',
  QUESTION_MARK = 'QUESTION_MARK',
  COLON = 'COLON',
  COMMA = 'COMMA',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
  OPEN_BRACKET = 'OPEN_BRACKET',
  CLOSE_BRACKET = 'CLOSE_BRACKET',
  UNKNOWN = 'UNKNOWN',
}

export type Token = (
  | { kind: TokenKind.IDENTIFIER; value: string }
  | { kind: TokenKind.VARIADIC_MARKER }
  | { kind: TokenKind.STRING; value: string }
  | { kind: TokenKind.OR }
  | { kind: TokenKind.AT }
  | { kind: TokenKind.QUESTION_MARK }
  | { kind: TokenKind.COLON }
  | { kind: TokenKind.COMMA }
  | { kind: TokenKind.OPEN_PAREN }
  | { kind: TokenKind.CLOSE_PAREN }
  | { kind: TokenKind.OPEN_BRACKET }
  | { kind: TokenKind.CLOSE_BRACKET }
  | { kind: TokenKind.UNKNOWN }
) & { raw: string; span: Span }

export function tokenize(input: string): Token[] {
  let tokens: Token[] = []
  let eof = input.length

  for (let idx = 0; idx < input.length; idx++) {
    let char = input.charCodeAt(idx)

    // Skip whitespace
    if (char === SPACE || char === TAB || char === NEWLINE || char === LINE_FEED) {
      continue
    }

    // Identifier
    let identifier = tokenizeIdentifier(input, idx)
    if (identifier) {
      tokens.push(identifier)
      idx = identifier.span.end - 1
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

    // At sign
    if (char === AT) {
      tokens.push({ kind: TokenKind.AT, raw: '@', span: { start: idx, end: idx + 1 } })

      // Identifier
      let identifier = tokenizeIdentifier(input, idx + 1)
      if (identifier === null) throw new Error('Expected identifier')
      tokens.push(identifier)
      idx = identifier.span.end

      // Param expects an identifier
      if (identifier.value === 'param') {
        let identifier = tokenizeIdentifier(input, idx + 1)
        if (identifier === null) throw new Error('Expected identifier')
        tokens.push(identifier)
        idx = identifier.span.end
      }

      // No parameters
      if (identifier.value === 'internal') {
        // Read until the end of the line
        while (
          input.charCodeAt(idx) !== NEWLINE && //
          input.charCodeAt(idx) !== LINE_FEED
        ) {
          idx++
        }
        continue
      }

      // Skip whitespace
      char = input.charCodeAt(idx)
      while (char === SPACE || char === TAB || char === NEWLINE || char === LINE_FEED) {
        char = input.charCodeAt(++idx)
      }

      // Rest until the end of the line is a string
      let start = idx
      do {
        char = input.charCodeAt(++idx)
      } while (char !== NEWLINE && char !== LINE_FEED && idx < eof)

      tokens.push({
        kind: TokenKind.STRING,
        value: input.slice(start, idx).trim(),
        raw: input.slice(start, idx),
        span: { start, end: idx },
      })
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

    // Open bracket
    if (char === OPEN_BRACKET) {
      tokens.push({
        kind: TokenKind.OPEN_BRACKET,
        raw: '[',
        span: { start: idx, end: idx + 1 },
      })
      continue
    }

    // Close bracket
    if (char === CLOSE_BRACKET) {
      tokens.push({
        kind: TokenKind.CLOSE_BRACKET,
        raw: ']',
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

function tokenizeIdentifier(input: string, idx: number) {
  let char = input.charCodeAt(idx)
  let eof = input.length

  if ((char >= UPPER_A && char <= UPPER_Z) || (char >= LOWER_A && char <= LOWER_Z)) {
    let start = idx
    do {
      char = input.charCodeAt(++idx)
    } while (
      ((char >= UPPER_A && char <= UPPER_Z) ||
        (char >= LOWER_A && char <= LOWER_Z) ||
        (char >= ZERO && char <= NINE) ||
        char === UNDERSCORE) &&
      idx < eof
    )
    let end = idx--

    return {
      kind: TokenKind.IDENTIFIER,
      value: input.slice(start, end),
      raw: input.slice(start, end),
      span: { start, end },
    }
  }

  return null
}
