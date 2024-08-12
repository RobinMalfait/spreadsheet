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
  ASTERISK = 'ASTERISK',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  FORWARD_SLASH = 'FORWARD_SLASH',
  ANGLE_LEFT = 'ANGLE_LEFT',
  EQUALS = 'EQUALS',
  ANGLE_RIGHT = 'ANGLE_RIGHT',
}

type Token =
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

// ---

export enum AstKind {
  CELL = 'CELL',
  RANGE = 'RANGE',
  FUNCTION = 'FUNCTION',
  NUMBER_LITERAL = 'NUMBER',
  STRING_LITERAL = 'STRING',
  BINARY_EXPRESSION = 'BINARY_EXPRESSION',
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

export enum BinaryExpressionOperator {
  TIMES = 'TIMES',
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  DIVIDE = 'DIVIDE',
  LESS_THAN = 'LESS_THAN',
  EQUALS = 'EQUALS',
  GREATER_THAN = 'GREATER_THAN',
}

export type AstBinaryExpression = {
  kind: AstKind.BINARY_EXPRESSION
  operator: BinaryExpressionOperator
  lhs: AST
  rhs: AST
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
  | AstBinaryExpression

export function parseExpression(tokens: Token[]): AST {
  return new ExpressionParser(tokens).parseExpression(0)
}

class ExpressionParser {
  private tokens: Token[]

  constructor(tokens: Token[]) {
    this.tokens = tokens.slice()
  }

  isBinaryOperator(token: Token) {
    return (
      token.kind === TokenKind.ASTERISK ||
      token.kind === TokenKind.PLUS ||
      token.kind === TokenKind.MINUS ||
      token.kind === TokenKind.FORWARD_SLASH ||
      token.kind === TokenKind.ANGLE_LEFT ||
      token.kind === TokenKind.EQUALS ||
      token.kind === TokenKind.ANGLE_RIGHT
    )
  }

  toBinaryOperator(token: Token) {
    switch (token.kind) {
      case TokenKind.ASTERISK:
        return BinaryExpressionOperator.TIMES
      case TokenKind.PLUS:
        return BinaryExpressionOperator.ADD
      case TokenKind.MINUS:
        return BinaryExpressionOperator.SUBTRACT
      case TokenKind.FORWARD_SLASH:
        return BinaryExpressionOperator.DIVIDE
      case TokenKind.ANGLE_LEFT:
        return BinaryExpressionOperator.LESS_THAN
      case TokenKind.EQUALS:
        return BinaryExpressionOperator.EQUALS
      case TokenKind.ANGLE_RIGHT:
        return BinaryExpressionOperator.GREATER_THAN
      default:
        throw new Error(`Invalid binary operator: ${JSON.stringify(token, null, 2)}`)
    }
  }

  getPrecedence(token: Token) {
    if (token.kind === TokenKind.EQUALS) {
      return 4
    }

    if (token.kind === TokenKind.ANGLE_LEFT || token.kind === TokenKind.ANGLE_RIGHT) {
      return 3
    }

    if (token.kind === TokenKind.ASTERISK || token.kind === TokenKind.FORWARD_SLASH) {
      return 2
    }

    if (token.kind === TokenKind.PLUS || token.kind === TokenKind.MINUS) {
      return 1
    }

    return 0
  }

  parseIncreasingPrecedence(lhs: AST, precedence: number): AST {
    let next = this.tokens.shift()
    if (!next) return lhs

    let nextPrecedence = this.getPrecedence(next)
    if (nextPrecedence <= precedence) {
      this.tokens.unshift(next)
      return lhs
    }

    if (!this.isBinaryOperator(next)) return lhs

    return {
      kind: AstKind.BINARY_EXPRESSION,
      operator: this.toBinaryOperator(next),
      lhs,
      rhs: this.parseExpression(nextPrecedence),
    }
  }

  parseExpression(precedence: number): AST {
    let lhs = this.parseLeaf()
    while (true) {
      let node = this.parseIncreasingPrecedence(lhs, precedence)
      if (node === lhs) break
      lhs = node
    }
    return lhs
  }

  parseLeaf(): AST {
    let token = this.tokens.shift()
    if (!token) throw new Error('Invalid expression')

    switch (token.kind) {
      case TokenKind.PLUS: {
        let next = this.tokens[0]

        if (next?.kind === TokenKind.NUMBER_LITERAL) {
          return { kind: AstKind.NUMBER_LITERAL, value: +next.value }
        }

        throw new Error('Invalid expression')
      }

      case TokenKind.MINUS: {
        let next = this.tokens[0]

        if (next?.kind === TokenKind.NUMBER_LITERAL) {
          return { kind: AstKind.NUMBER_LITERAL, value: -next.value }
        }

        throw new Error('Invalid expression')
      }

      case TokenKind.NUMBER_LITERAL:
        return { kind: AstKind.NUMBER_LITERAL, value: token.value }

      case TokenKind.STRING_LITERAL:
        return { kind: AstKind.STRING_LITERAL, value: token.value }

      case TokenKind.IDENTIFIER: {
        let peek = this.tokens[0]
        if (!peek) {
          // Cell reference
          return {
            kind: AstKind.CELL,
            name: token.value,
            loc: parseLocation(token.value),
          }
        }

        // Cell range
        if (peek.kind === TokenKind.COLON) {
          this.tokens.shift() // :
          let end = this.tokens.shift() // End
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
        if (peek.kind === TokenKind.OPEN_PAREN) {
          // Skip open paren
          let open = this.tokens.shift()
          if (open?.kind !== TokenKind.OPEN_PAREN) {
            throw new Error('Invalid function call')
          }

          // Each argument is separated by a comma, it could be that multiple
          // tokens are required for a single expression
          let args: Token[][] = []

          // Track paren stack
          let stack = 0

          // Track tokens for next argument
          let argTokens: Token[] = []

          // Find closing paren
          loop: while (this.tokens.length > 0) {
            // biome-ignore lint/style/noNonNullAssertion: We already verified that there is at least 1 remaining token
            let next = this.tokens.shift()!

            switch (next.kind) {
              // Nested function call, or just a parenthesized expression
              case TokenKind.OPEN_PAREN:
                argTokens.push(next)
                stack++
                break

              // End of function call, but might not be the current function
              // call
              case TokenKind.CLOSE_PAREN:
                if (stack === 0) {
                  if (argTokens.length > 0) {
                    args.push(argTokens.splice(0))
                  }

                  break loop
                }

                // Close paren for nested parenthesized expression
                argTokens.push(next)
                stack--
                break

              // Argument separator
              case TokenKind.COMMA:
                if (stack === 0 && argTokens.length > 0) {
                  args.push(argTokens.splice(0))
                }

                if (stack !== 0) {
                  argTokens.push(next)
                }
                break

              // Token belongs to the current argument
              default:
                argTokens.push(next)
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

      // Parenthesized expression
      case TokenKind.OPEN_PAREN: {
        let expression = this.parseExpression(0)
        let close = this.tokens.shift()

        if (close?.kind !== TokenKind.CLOSE_PAREN) {
          throw new Error('Invalid expression')
        }

        return expression
      }
    }

    throw new Error('Invalid expression')
  }
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
    case AstKind.BINARY_EXPRESSION:
      return `(${printExpression(input.lhs)} ${printBinaryOperator(input.operator)} ${printExpression(input.rhs)})`
  }
}

function printBinaryOperator(operator: BinaryExpressionOperator) {
  switch (operator) {
    case BinaryExpressionOperator.TIMES:
      return '*'
    case BinaryExpressionOperator.ADD:
      return '+'
    case BinaryExpressionOperator.SUBTRACT:
      return '-'
    case BinaryExpressionOperator.DIVIDE:
      return '/'
    case BinaryExpressionOperator.LESS_THAN:
      return '<'
    case BinaryExpressionOperator.EQUALS:
      return '='
    case BinaryExpressionOperator.GREATER_THAN:
      return '>'
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
