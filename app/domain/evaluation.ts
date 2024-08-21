import { format } from 'date-fns'
import { type AST, AstKind, BinaryExpressionOperator } from '~/domain/ast'
import * as functions from '~/domain/functions'
import type { Spreadsheet } from '~/domain/spreadsheet'
import { expandRange } from '~/domain/walk-ast'

export enum EvaluationResultKind {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  DATETIME = 'DATETIME',
}

export type EvaluationResult =
  | { kind: EvaluationResultKind.NUMBER; value: number }
  | { kind: EvaluationResultKind.STRING; value: string }
  | { kind: EvaluationResultKind.BOOLEAN; value: boolean }
  | { kind: EvaluationResultKind.DATETIME; value: Date; date: boolean; time: boolean }

export function evaluateExpression(
  ast: AST,
  spreadsheet: Spreadsheet,
): EvaluationResult[] {
  switch (ast.kind) {
    case AstKind.NUMBER_LITERAL:
      return [{ kind: EvaluationResultKind.NUMBER, value: ast.value }]

    case AstKind.STRING_LITERAL: {
      if (ast.value.trim() === '') {
        return [{ kind: EvaluationResultKind.STRING, value: ast.value }]
      }

      // Try to coerce the string to a number, and if it works, return a number
      // instead of a string
      let asNumber = Number(ast.value)
      if (!Number.isNaN(asNumber)) {
        return [{ kind: EvaluationResultKind.NUMBER, value: asNumber }]
      }

      return [{ kind: EvaluationResultKind.STRING, value: ast.value }]
    }

    case AstKind.CELL:
      return spreadsheet.evaluate(ast.name)

    case AstKind.RANGE: {
      let out = []
      for (let cell of expandRange(ast)) {
        for (let child of spreadsheet.evaluate(cell)) {
          out.push(child)
        }
      }
      return out
    }

    case AstKind.BINARY_EXPRESSION: {
      let lhs = evaluateExpression(ast.lhs, spreadsheet)
      let rhs = evaluateExpression(ast.rhs, spreadsheet)

      if (lhs.length !== 1 || rhs.length !== 1) {
        throw new Error('Expected a single result from each side')
      }

      let left = lhs[0]
      let right = rhs[0]

      if (
        left?.kind === EvaluationResultKind.NUMBER &&
        right?.kind === EvaluationResultKind.NUMBER
      ) {
        switch (ast.operator) {
          // Math operators
          case BinaryExpressionOperator.EXPONENT:
            return [functions.POWER(left, right)]
          case BinaryExpressionOperator.MULTIPLY:
            return [functions.MULTIPLY(left, right)]
          case BinaryExpressionOperator.DIVIDE:
            return [functions.DIVIDE(left, right)]
          case BinaryExpressionOperator.ADD:
            return [functions.SUM(left, right)]
          case BinaryExpressionOperator.SUBTRACT:
            return [functions.SUBTRACT(left, right)]

          // Comparison operators
          case BinaryExpressionOperator.EQUALS:
            return left.value === right.value ? [functions.TRUE()] : [functions.FALSE()]
          case BinaryExpressionOperator.NOT_EQUALS:
            return left.value !== right.value ? [functions.TRUE()] : [functions.FALSE()]
          case BinaryExpressionOperator.LESS_THAN:
            return left.value < right.value ? [functions.TRUE()] : [functions.FALSE()]
          case BinaryExpressionOperator.LESS_THAN_EQUALS:
            return left.value <= right.value ? [functions.TRUE()] : [functions.FALSE()]
          case BinaryExpressionOperator.GREATER_THAN:
            return left.value > right.value ? [functions.TRUE()] : [functions.FALSE()]
          case BinaryExpressionOperator.GREATER_THAN_EQUALS:
            return left.value >= right.value ? [functions.TRUE()] : [functions.FALSE()]
          default:
            ast.operator satisfies never
        }
      }

      throw new Error(`Invalid operation \`${ast.kind}\``)
    }

    case AstKind.FUNCTION: {
      if (!Object.hasOwn(functions, ast.name)) {
        throw new Error(`Unknown function \`${ast.name}\``)
      }

      let fn = functions[ast.name as keyof typeof functions]
      let args = ast.args.flatMap((arg) => evaluateExpression(arg, spreadsheet))
      // @ts-expect-error Some functions have a different arity, but we're not
      // checking that here.
      let result = fn(...args)
      if (Array.isArray(result)) {
        return result
      }
      return [result]
    }
  }
}

export function printEvaluationResult(result: EvaluationResult): string {
  switch (result.kind) {
    case EvaluationResultKind.NUMBER:
      return result.value.toString()
    case EvaluationResultKind.STRING:
      return result.value
    case EvaluationResultKind.BOOLEAN:
      return result.value ? 'TRUE' : 'FALSE'
    case EvaluationResultKind.DATETIME:
      if (result.date && result.time) return format(result.value, 'yyyy-MM-dd HH:mm:ss')
      if (result.date) return format(result.value, 'yyyy-MM-dd')
      return format(result.value, 'HH:mm:ss')
    default:
      result satisfies never
      return ''
  }
}
