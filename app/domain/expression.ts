import { type AST, type AstCell, AstKind, BinaryExpressionOperator } from '~/domain/ast'
import { type Token, TokenKind } from '~/domain/tokenizer'

const DOLLAR = 36 // $
const UPPER_A = 65 // A
const UPPER_Z = 90 // Z

const PRECEDENCE_MAP = {
  // Exponentiation
  [TokenKind.EXPONENT]: 4,

  // Multiplication and division
  [TokenKind.ASTERISK]: 3,
  [TokenKind.DIVIDE]: 3,

  // Addition and subtraction
  [TokenKind.PLUS]: 2,
  [TokenKind.MINUS]: 2,

  // Comparison operators
  [TokenKind.EQUALS]: 1,
  [TokenKind.NOT_EQUALS]: 1,
  [TokenKind.LESS_THAN]: 1,
  [TokenKind.LESS_THAN_EQUALS]: 1,
  [TokenKind.GREATER_THAN]: 1,
  [TokenKind.GREATER_THAN_EQUALS]: 1,
}

const BINARY_OP_MAP: Record<keyof typeof PRECEDENCE_MAP, BinaryExpressionOperator> = {
  // Math operators
  [TokenKind.EXPONENT]: BinaryExpressionOperator.EXPONENT,
  [TokenKind.ASTERISK]: BinaryExpressionOperator.MULTIPLY,
  [TokenKind.PLUS]: BinaryExpressionOperator.ADD,
  [TokenKind.MINUS]: BinaryExpressionOperator.SUBTRACT,
  [TokenKind.DIVIDE]: BinaryExpressionOperator.DIVIDE,

  // Comparison operators
  [TokenKind.LESS_THAN]: BinaryExpressionOperator.LESS_THAN,
  [TokenKind.LESS_THAN_EQUALS]: BinaryExpressionOperator.LESS_THAN_EQUALS,
  [TokenKind.EQUALS]: BinaryExpressionOperator.EQUALS,
  [TokenKind.NOT_EQUALS]: BinaryExpressionOperator.NOT_EQUALS,
  [TokenKind.GREATER_THAN]: BinaryExpressionOperator.GREATER_THAN,
  [TokenKind.GREATER_THAN_EQUALS]: BinaryExpressionOperator.GREATER_THAN_EQUALS,
}

export function parse(tokens: Token[]): AST {
  let todo = tokens.slice() // Operate on a copy
  let result = parseExpression(todo)
  if (todo.length > 0) {
    throw new Error('Invalid expression')
  }
  return result
}

function parseExpression(tokens: Token[], precedence = 0) {
  let lhs = parseLeaf(tokens)
  while (tokens.length > 0) {
    let node = parseIncreasingPrecedence(tokens, lhs, precedence)
    if (node === lhs) break
    lhs = node
  }
  return lhs
}

function parseIncreasingPrecedence(tokens: Token[], lhs: AST, precedence = 0): AST {
  let next = tokens.shift()
  if (!next) return lhs

  let nextPrecedence = PRECEDENCE_MAP[next.kind as keyof typeof PRECEDENCE_MAP] ?? 0
  if (nextPrecedence <= precedence) {
    tokens.unshift(next)
    return lhs
  }

  if (!(next.kind in PRECEDENCE_MAP)) return lhs

  let rhs = parseExpression(tokens, nextPrecedence)

  return {
    kind: AstKind.BINARY_EXPRESSION,
    operator: BINARY_OP_MAP[next.kind as keyof typeof BINARY_OP_MAP],
    lhs,
    rhs,
    span: { start: lhs.span.start, end: rhs.span.end },
  }
}

function parseLeaf(tokens: Token[]): AST {
  let token = tokens.shift()
  if (!token) throw new Error('Unexpected end of input')

  switch (token.kind) {
    case TokenKind.PLUS: {
      let next = tokens[0]

      if (next?.kind === TokenKind.NUMBER_LITERAL) {
        tokens.shift() // Consume next token
        return {
          kind: AstKind.NUMBER_LITERAL,
          value: +next.value,
          span: {
            start: token.span.start,
            end: next.span.end,
          },
        }
      }

      throw new Error(
        `Invalid expression, expected number literal, got ${next?.raw ?? '<nothing>'}`,
      )
    }

    case TokenKind.MINUS: {
      let next = tokens[0]

      if (next?.kind === TokenKind.NUMBER_LITERAL) {
        tokens.shift() // Consume next token
        return {
          kind: AstKind.NUMBER_LITERAL,
          value: -next.value,
          span: {
            start: token.span.start,
            end: next.span.end,
          },
        }
      }

      throw new Error(
        `Invalid expression, expected number literal, got ${next?.raw ?? '<nothing>'}`,
      )
    }

    case TokenKind.NUMBER_LITERAL:
      return { kind: AstKind.NUMBER_LITERAL, value: token.value, span: token.span }

    case TokenKind.STRING_LITERAL:
      return { kind: AstKind.STRING_LITERAL, value: token.value, span: token.span }

    // Locked cell reference / ranges
    case TokenKind.DOLLAR: {
      tokens.unshift(token) // Put back the `$` token

      let lhs = parseCellReference(tokens)
      if (tokens[0]?.kind === TokenKind.COLON) {
        tokens.shift() // Consume colon
        let rhs = parseCellReference(tokens)

        // @ts-expect-error We mutated `tokens` via `tokens.shift()`, so the `tokens[0]` _can_ be different.
        if (tokens[0]?.kind === TokenKind.OPEN_PAREN) {
          throw new Error('Invalid cell range')
        }

        return {
          kind: AstKind.RANGE,
          raw: `${lhs.raw}:${rhs.raw}`,
          start: lhs,
          end: rhs,
          span: {
            start: lhs.span.start,
            end: rhs.span.end,
          },
        }
      }

      if (tokens[0]?.kind === TokenKind.OPEN_PAREN) {
        throw new Error('Invalid cell reference')
      }

      return lhs
    }

    case TokenKind.IDENTIFIER: {
      let peek = tokens[0]

      // Function call
      if (peek?.kind === TokenKind.OPEN_PAREN) {
        // Skip open paren
        let openParen = tokens.shift()
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
        loop: while (tokens.length > 0) {
          // biome-ignore lint/style/noNonNullAssertion: We already verified that there is at least 1 remaining token
          let next = tokens.shift()!

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
          args: args.map(parse),
          span: {
            start: token.span.start,
            end: closeParen.span.end,
          },
        }
      }

      // Cell reference or cell range
      tokens.unshift(token) // Put back the identifier token

      let lhs = parseCellReference(tokens)
      if (tokens[0]?.kind === TokenKind.COLON) {
        tokens.shift() // Consume colon
        let rhs = parseCellReference(tokens)

        // @ts-expect-error We mutated `tokens` via `tokens.shift()`, so the `tokens[0]` _can_ be different.
        if (tokens[0]?.kind === TokenKind.OPEN_PAREN) {
          throw new Error('Invalid cell range')
        }

        return {
          kind: AstKind.RANGE,
          raw: `${lhs.raw}:${rhs.raw}`,
          start: lhs,
          end: rhs,
          span: {
            start: lhs.span.start,
            end: rhs.span.end,
          },
        }
      }

      if (tokens[0]?.kind === TokenKind.OPEN_PAREN) {
        throw new Error('Invalid cell reference')
      }

      return lhs
    }

    // Parenthesized expression
    case TokenKind.OPEN_PAREN: {
      let expression = parseExpression(tokens)
      let close = tokens.shift()

      if (close?.kind !== TokenKind.CLOSE_PAREN) {
        throw new Error(`Invalid expression, expected \`)\` got \`${token.raw}\``)
      }

      return expression
    }
  }

  throw new Error(`Invalid expression, unexpected token: ${token.raw}`)
}

function parseCellReference(tokens: Token[]): AstCell {
  let lockCol: Token | null = null
  let lockRow: Token | null = null
  let start: Token | null = null
  let end: Token | null = null
  let name = ''
  let raw = ''

  let peek = tokens[0]
  if (!peek) throw new Error('Invalid cell reference')

  // $A1
  // ^
  if (peek.kind === TokenKind.DOLLAR) {
    // biome-ignore lint/style/noNonNullAssertion: we verified that `peek` exists, therefore `tokens` is not empty and `.shift()` will return a value.
    lockCol = tokens.shift()! // $
    start ??= lockCol
    end = lockCol
    raw += lockCol.raw
  }

  // $A1 or A1
  //  ^^    ^^
  peek = tokens[0]
  if (!peek) throw new Error('Invalid cell reference')
  if (peek.kind !== TokenKind.IDENTIFIER) throw new Error('Invalid cell reference')

  // biome-ignore lint/style/noNonNullAssertion: we verified that `peek` exists, therefore `tokens` is not empty and `.shift()` will return a value.
  peek = tokens.shift()! // Consume identifier
  start ??= peek
  end = peek
  name += (peek as Extract<Token, { kind: TokenKind.IDENTIFIER }>).value
  raw += peek.raw

  // A$1 or $A$1
  //  ^       ^
  peek = tokens[0]
  if (peek?.kind === TokenKind.DOLLAR) {
    // biome-ignore lint/style/noNonNullAssertion: we verified that `peek` exists, therefore `tokens` is not empty and `.shift()` will return a value.
    lockRow = tokens.shift()! // $
    start ??= lockRow
    end = lockRow
    raw += lockRow.raw

    // A$1
    //   ^
    peek = tokens[0]
    if (!peek) throw new Error('Invalid cell reference')
    if (peek.kind !== TokenKind.NUMBER_LITERAL) throw new Error('Invalid cell reference')

    // biome-ignore lint/style/noNonNullAssertion: we verified that `peek` exists, therefore `tokens` is not empty and `.shift()` will return a value.
    peek = tokens.shift()! // Consume number
    start ??= peek
    end = peek
    name += peek.raw
    raw += peek.raw
  }

  return {
    kind: AstKind.CELL,
    name,
    raw,
    loc: parseLocation(raw),
    span: {
      start: start.span.start,
      end: end.span.end,
    },
  }
}

export type Location = {
  col: number
  row: number
  lock: number
}

enum Lock {
  COL = 1 << 0,
  ROW = 1 << 1,
}

export function parseLocation(input: string): Location {
  let lock = 0

  let idx = 0
  let char = input.charCodeAt(idx)

  // Locked column
  if (char === DOLLAR) {
    lock |= Lock.COL
    char = input.charCodeAt(++idx)
  }

  do {
    char = input.charCodeAt(++idx)
  } while (char >= UPPER_A && char <= UPPER_Z)

  let col = parseColNumber(input.slice(0, idx))

  // Locked row
  if (char === DOLLAR) {
    lock |= Lock.ROW
    char = input.charCodeAt(++idx)
  }

  let row = Number(input.slice(idx))

  return { col, row, lock }
}

export function parseColNumber(input: string) {
  let col = 0

  for (let i = 0; i < input.length; i++) {
    let char = input.charCodeAt(i)
    // Ignore dollar signs, they are used for locking the column or row.
    if (char === DOLLAR) continue

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
      return input.raw.toUpperCase()
    case AstKind.RANGE:
      return input.raw.toUpperCase()
    case AstKind.FUNCTION:
      return `${input.name.toUpperCase()}(${input.args.map(printExpression).join(', ')})`
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
      return '=='
    case BinaryExpressionOperator.NOT_EQUALS:
      return '!='
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

export function printLocation(location: Location, locked = false) {
  if (locked) {
    return `${location.lock & Lock.COL ? '$' : ''}${printColNumber(location.col)}${location.lock & Lock.ROW ? '$' : ''}${location.row}`
  }

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
