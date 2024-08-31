import type { Location } from '~/domain/expression'

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
  raw: string
  loc: Location
}

export interface AstCellRange extends Span {
  kind: AstKind.RANGE
  raw: string
  start: AstCell
  end: AstCell
}

export interface AstFunction extends Span {
  kind: AstKind.FUNCTION
  name: string
  args: AST[]
}

interface AstNumberLiteral extends Span {
  kind: AstKind.NUMBER_LITERAL
  value: number
}

interface AstStringLiteral extends Span {
  kind: AstKind.STRING_LITERAL
  value: string
}

interface AstBinaryExpression extends Span {
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
