const TAB = 9 // '\t'
const NEWLINE = 10 // '\n'
const LINE_FEED = 13 // '\r'
const SPACE = 32 // ' '
const DOUBLE_QUOTE = 34 // "
const OPEN_PAREN = 40 // (
const CLOSE_PAREN = 41 // )
const COMMA = 44 // ,
const MINUS = 45 // -
const POINT = 46 // .
const ZERO = 48 // 0
const NINE = 57 // 9
const COLON = 58 // :
const UPPER_A = 65 // A
const UPPER_Z = 90 // Z
const LOWER_A = 97 // a
const LOWER_Z = 122 // z

/**
 * TOKENIZATION
 */

enum TokenKind {
  IDENTIFIER = 'IDENTIFIER',
  NUMBER_LITERAL = 'NUMBER',
  STRING_LITERAL = 'STRING',
  COMMA = 'COMMA',
  COLON = 'COLON',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
}

type Token =
  | { kind: TokenKind.IDENTIFIER; value: string }
  | { kind: TokenKind.NUMBER_LITERAL; value: number }
  | { kind: TokenKind.STRING_LITERAL; value: string }
  | { kind: TokenKind.COMMA }
  | { kind: TokenKind.COLON }
  | { kind: TokenKind.OPEN_PAREN }
  | { kind: TokenKind.CLOSE_PAREN }

export function tokenizeExpression(input: string): Token[] {
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
    if ((char >= ZERO && char <= NINE) || char === MINUS) {
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

// ---

export enum AstKind {
  CELL = 'CELL',
  RANGE = 'RANGE',
  FUNCTION = 'FUNCTION',
  NUMBER_LITERAL = 'NUMBER',
  STRING_LITERAL = 'STRING',
}

export type AstCell = {
  kind: AstKind.CELL
  name: string
  loc: {
    col: number
    row: number
  }
}

export type AstCellRange = {
  kind: AstKind.RANGE
  start: AstCell
  end: AstCell
}

export type AstFunction = {
  kind: AstKind.FUNCTION
  name: string
  args: AST[]
}

export type AstNumberLiteral = {
  kind: AstKind.NUMBER_LITERAL
  value: number
}

export type AstStringLiteral = {
  kind: AstKind.STRING_LITERAL
  value: string
}

export type AST =
  | AstCell
  | AstCellRange
  | AstFunction
  | AstNumberLiteral
  | AstStringLiteral

export function parseExpression(tokens: Token[]): AST {
  for (let idx = 0; idx < tokens.length; idx++) {
    let token = tokens[idx]

    switch (token.kind) {
      case TokenKind.NUMBER_LITERAL:
        return { kind: AstKind.NUMBER_LITERAL, value: token.value }

      case TokenKind.STRING_LITERAL:
        return { kind: AstKind.STRING_LITERAL, value: token.value }

      case TokenKind.IDENTIFIER: {
        let next = tokens[idx + 1]
        if (!next) {
          // Cell reference
          return {
            kind: AstKind.CELL,
            name: token.value,
            loc: parseLocation(token.value),
          }
        }

        // Cell range
        if (next.kind === TokenKind.COLON) {
          let end = tokens[idx + 2]
          if (!end || end.kind !== TokenKind.IDENTIFIER) {
            throw new Error('Invalid cell range')
          }

          return {
            kind: AstKind.RANGE,
            start: {
              kind: AstKind.CELL,
              name: token.value,
              loc: parseLocation(token.value),
            },
            end: {
              kind: AstKind.CELL,
              name: end.value,
              loc: parseLocation(end.value),
            },
          }
        }

        // Function call
        if (next.kind === TokenKind.OPEN_PAREN) {
          // Each argument is separated by a comma, it could be that multiple
          // tokens are required for a single expression
          let args: Token[][] = []

          // Track paren stack
          let stack = 0

          // Start of current arguments list
          let start = idx + 2

          // Find closing paren
          loop: for (let j = idx + 2; j < tokens.length; j++) {
            switch (tokens[j].kind) {
              // Nested function call
              case TokenKind.OPEN_PAREN:
                stack++
                break

              // End of function call, but might not be the current function
              // call
              case TokenKind.CLOSE_PAREN:
                if (stack === 0) {
                  args.push(tokens.slice(start, j))
                  break loop
                }
                stack--
                break

              // Argument separator
              case TokenKind.COMMA:
                if (stack === 0) {
                  args.push(tokens.slice(start, j))
                  start = j + 1
                }
                break
            }
          }

          return {
            kind: AstKind.FUNCTION,
            name: token.value,
            args: args.map((list) => parseExpression(list)),
          }
        }

        // Cell reference
        return {
          kind: AstKind.CELL,
          name: token.value,
          loc: parseLocation(token.value),
        }
      }
    }
  }

  throw new Error('Not implemented')
}

type Location = {
  col: number
  row: number
}

export function parseLocation(input: string): Location {
  let idx = 0
  let char = input.charCodeAt(idx)
  do {
    char = input.charCodeAt(++idx)
  } while (char >= UPPER_A && char <= UPPER_Z)

  return {
    col: parseColNumber(input.slice(0, idx)),
    row: Number(input.slice(idx)),
  }
}

export function printLocation(location: Location) {
  return `${printColNumber(location.col)}${location.row}`
}

function printColNumber(input: number) {
  let remaining = input
  let col = ''

  while (remaining > 0) {
    let mod = (remaining - 1) % 26
    col = String.fromCharCode(UPPER_A + mod) + col
    remaining = Math.floor((remaining - mod) / 26)
  }

  return col
}

export function parseColNumber(input: string) {
  let col = 0

  for (let i = 0; i < input.length; i++) {
    let char = input.charCodeAt(i)
    if (char < UPPER_A || char > UPPER_Z) {
      throw new Error('Invalid column number')
    }
    col *= 26 // Base 26, shift left
    col += char - UPPER_A // Normalize to 0-indexed
    col += 1 // 1-indexed
  }

  return col
}

/**
 * Print AST
 */
export function printExpression(input: AST): string {
  switch (input.kind) {
    case AstKind.CELL:
      return input.name
    case AstKind.RANGE:
      return `${input.start.name}:${input.end.name}`
    case AstKind.FUNCTION:
      return `${input.name}(${input.args.map(printExpression).join(', ')})`
    case AstKind.NUMBER_LITERAL:
      return input.value.toString()
    case AstKind.STRING_LITERAL:
      return `"${input.value}"`
  }
}
