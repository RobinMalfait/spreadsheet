import { type Token, TokenKind } from './tokenizer'

const UPPER_A = 65 // A
const UPPER_Z = 90 // Z

export enum AstKind {
  CELL = 'CELL',
  RANGE = 'RANGE',
  FUNCTION = 'FUNCTION',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  STRING_LITERAL = 'STRING_LITERAL',
  BINARY_EXPRESSION = 'BINARY_EXPRESSION',
}

interface Span {
  span: {
    start: number
    end: number
  }
}

export interface AstCell extends Span {
  kind: AstKind.CELL
  name: string
  loc: {
    col: number
    row: number
  }
}

export interface AstCellRange extends Span {
  kind: AstKind.RANGE
  start: AstCell
  end: AstCell
}

export interface AstFunction extends Span {
  kind: AstKind.FUNCTION
  name: string
  args: AST[]
}

export interface AstNumberLiteral extends Span {
  kind: AstKind.NUMBER_LITERAL
  value: number
}

export interface AstStringLiteral extends Span {
  kind: AstKind.STRING_LITERAL
  value: string
}

export enum BinaryExpressionOperator {
  // Math operators
  EXPONENT = 'EXPONENT',
  MULTIPLY = 'MULTIPLY',
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  DIVIDE = 'DIVIDE',

  // Comparison operators
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_EQUALS = 'LESS_THAN_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_EQUALS = 'GREATER_THAN_EQUALS',
}

export interface AstBinaryExpression extends Span {
  kind: AstKind.BINARY_EXPRESSION
  operator: BinaryExpressionOperator
  lhs: AST
  rhs: AST
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
  constructor(private tokens: Token[]) {
    this.tokens = tokens.slice()
  }

  isBinaryOperator(token: Token) {
    return (
      // Math operators
      token.kind === TokenKind.EXPONENT ||
      token.kind === TokenKind.ASTERISK ||
      token.kind === TokenKind.PLUS ||
      token.kind === TokenKind.MINUS ||
      token.kind === TokenKind.DIVIDE ||
      // Comparison operators
      token.kind === TokenKind.LESS_THAN ||
      token.kind === TokenKind.EQUALS ||
      token.kind === TokenKind.GREATER_THAN ||
      token.kind === TokenKind.LESS_THAN_EQUALS ||
      token.kind === TokenKind.GREATER_THAN_EQUALS ||
      token.kind === TokenKind.NOT_EQUALS
    )
  }

  toBinaryOperator(token: Token) {
    switch (token.kind) {
      // Math operators
      case TokenKind.EXPONENT:
        return BinaryExpressionOperator.EXPONENT
      case TokenKind.ASTERISK:
        return BinaryExpressionOperator.MULTIPLY
      case TokenKind.PLUS:
        return BinaryExpressionOperator.ADD
      case TokenKind.MINUS:
        return BinaryExpressionOperator.SUBTRACT
      case TokenKind.DIVIDE:
        return BinaryExpressionOperator.DIVIDE

      // Comparison operators
      case TokenKind.LESS_THAN:
        return BinaryExpressionOperator.LESS_THAN
      case TokenKind.LESS_THAN_EQUALS:
        return BinaryExpressionOperator.LESS_THAN_EQUALS
      case TokenKind.EQUALS:
        return BinaryExpressionOperator.EQUALS
      case TokenKind.NOT_EQUALS:
        return BinaryExpressionOperator.NOT_EQUALS
      case TokenKind.GREATER_THAN:
        return BinaryExpressionOperator.GREATER_THAN
      case TokenKind.GREATER_THAN_EQUALS:
        return BinaryExpressionOperator.GREATER_THAN_EQUALS
      default:
        throw new Error(`Invalid binary operator: ${token.raw}`)
    }
  }

  getPrecedence(token: Token) {
    // Exponentiation
    if (token.kind === TokenKind.EXPONENT) {
      return 4
    }

    // Multiplication and division
    if (token.kind === TokenKind.ASTERISK || token.kind === TokenKind.DIVIDE) {
      return 3
    }

    // Addition and subtraction
    if (token.kind === TokenKind.PLUS || token.kind === TokenKind.MINUS) {
      return 2
    }

    // Comparison operators
    if (
      token.kind === TokenKind.EQUALS ||
      token.kind === TokenKind.NOT_EQUALS ||
      token.kind === TokenKind.LESS_THAN ||
      token.kind === TokenKind.LESS_THAN_EQUALS ||
      token.kind === TokenKind.GREATER_THAN ||
      token.kind === TokenKind.GREATER_THAN_EQUALS
    ) {
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

    let rhs = this.parseExpression(nextPrecedence)

    return {
      kind: AstKind.BINARY_EXPRESSION,
      operator: this.toBinaryOperator(next),
      lhs,
      rhs,
      span: {
        start: lhs.span.start,
        end: rhs.span.end,
      },
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
    if (!token) throw new Error('Unexpected end of input')

    switch (token.kind) {
      case TokenKind.PLUS: {
        let next = this.tokens[0]

        if (next?.kind === TokenKind.NUMBER_LITERAL) {
          this.tokens.shift() // Consume next token
          return {
            kind: AstKind.NUMBER_LITERAL,
            value: +next.value,
            span: {
              start: token.span.start,
              end: next.span.end,
            },
          }
        }

        throw new Error(`Invalid expression, expected number literal, got ${next.raw}`)
      }

      case TokenKind.MINUS: {
        let next = this.tokens[0]

        if (next?.kind === TokenKind.NUMBER_LITERAL) {
          this.tokens.shift() // Consume next token
          return {
            kind: AstKind.NUMBER_LITERAL,
            value: -next.value,
            span: {
              start: token.span.start,
              end: next.span.end,
            },
          }
        }

        throw new Error(`Invalid expression, expected number literal, got ${next.raw}`)
      }

      case TokenKind.NUMBER_LITERAL:
        return { kind: AstKind.NUMBER_LITERAL, value: token.value, span: token.span }

      case TokenKind.STRING_LITERAL:
        return { kind: AstKind.STRING_LITERAL, value: token.value, span: token.span }

      case TokenKind.IDENTIFIER: {
        let peek = this.tokens[0]
        if (!peek) {
          // Cell reference
          return {
            kind: AstKind.CELL,
            name: token.value,
            loc: parseLocation(token.value),
            span: token.span,
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
              span: token.span,
            },
            end: {
              kind: AstKind.CELL,
              name: end.value,
              loc: parseLocation(end.value),
              span: end.span,
            },
            span: {
              start: token.span.start,
              end: end.span.end,
            },
          }
        }

        // Function call
        if (peek.kind === TokenKind.OPEN_PAREN) {
          // Skip open paren
          let openParen = this.tokens.shift()
          if (openParen?.kind !== TokenKind.OPEN_PAREN) {
            throw new Error('Invalid function call')
          }

          // Each argument is separated by a comma, it could be that multiple
          // tokens are required for a single expression
          let args: Token[][] = []

          // Track paren stack
          let stack = 0

          // Track tokens for next argument
          let argTokens: Token[] = []

          let closeParen: Token | null = null

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

                  closeParen = next
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

          if (!closeParen) {
            throw new Error('Invalid function call, missing closing paren')
          }

          return {
            kind: AstKind.FUNCTION,
            name: token.value,
            args: args.map((list) => parseExpression(list)),
            span: {
              start: token.span.start,
              end: closeParen.span.end,
            },
          }
        }

        // Cell reference
        return {
          kind: AstKind.CELL,
          name: token.value,
          loc: parseLocation(token.value),
          span: token.span,
        }
      }

      // Parenthesized expression
      case TokenKind.OPEN_PAREN: {
        let expression = this.parseExpression(0)
        let close = this.tokens.shift()

        if (close?.kind !== TokenKind.CLOSE_PAREN) {
          throw new Error(`Invalid expression, expected \`)\` got \`${token.raw}\``)
        }

        return expression
      }
    }

    throw new Error(`Invalid expression, unexpected token: ${token.raw}`)
  }
}

export type Location = {
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
export function printExpression(input: AST, depth = 0): string {
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
      return depth === 0
        ? `${printExpression(input.lhs, depth + 1)} ${printBinaryOperator(input.operator)} ${printExpression(input.rhs, depth + 1)}`
        : `(${printExpression(input.lhs, depth + 1)} ${printBinaryOperator(input.operator)} ${printExpression(input.rhs, depth + 1)})`
  }
}

function printBinaryOperator(operator: BinaryExpressionOperator) {
  switch (operator) {
    // Math operators
    case BinaryExpressionOperator.EXPONENT:
      return '^'
    case BinaryExpressionOperator.ADD:
      return '+'
    case BinaryExpressionOperator.SUBTRACT:
      return '-'
    case BinaryExpressionOperator.MULTIPLY:
      return '*'
    case BinaryExpressionOperator.DIVIDE:
      return '/'

    // Comparison operators
    case BinaryExpressionOperator.EQUALS:
      return '='
    case BinaryExpressionOperator.NOT_EQUALS:
      return '<>'
    case BinaryExpressionOperator.LESS_THAN:
      return '<'
    case BinaryExpressionOperator.LESS_THAN_EQUALS:
      return '<='
    case BinaryExpressionOperator.GREATER_THAN:
      return '>'
    case BinaryExpressionOperator.GREATER_THAN_EQUALS:
      return '>='

    default:
      operator satisfies never
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
