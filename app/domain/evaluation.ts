import { format } from 'date-fns'
import { type AST, AstKind, BinaryExpressionOperator } from '~/domain/ast'
import * as functions from '~/domain/functions'
import type { Spreadsheet } from '~/domain/spreadsheet'
import { expandRange } from '~/domain/walk-ast'
import { type EvaluationResult, EvaluationResultKind } from './evaluation-result'

export function evaluateExpression(
  ast: AST,
  spreadsheet: Spreadsheet,
): EvaluationResult | EvaluationResult[] {
  switch (ast.kind) {
    case AstKind.NUMBER_LITERAL:
      return { kind: EvaluationResultKind.NUMBER, value: ast.value }

    case AstKind.STRING_LITERAL: {
      if (ast.value.trim() === '') {
        return { kind: EvaluationResultKind.STRING, value: ast.value }
      }

      // Try to coerce the string to a number, and if it works, return a number
      // instead of a string
      let asNumber = Number(ast.value)
      if (!Number.isNaN(asNumber)) {
        return { kind: EvaluationResultKind.NUMBER, value: asNumber }
      }

      return { kind: EvaluationResultKind.STRING, value: ast.value }
    }

    case AstKind.CELL:
      return spreadsheet.evaluate(ast.name)

    case AstKind.RANGE: {
      let out = []
      for (let cell of expandRange(ast)) {
        let value = spreadsheet.evaluate(cell)
        if (Array.isArray(value)) {
          for (let child of value) {
            out.push(child)
          }
        } else {
          out.push(value)
        }
      }
      return out
    }

    case AstKind.BINARY_EXPRESSION: {
      let lhs = evaluateExpression(ast.lhs, spreadsheet)
      if (Array.isArray(lhs)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: 'Expected a single result from the left side',
        }
      }
      if (lhs.kind === EvaluationResultKind.ERROR) return lhs

      let rhs = evaluateExpression(ast.rhs, spreadsheet)
      if (Array.isArray(rhs)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: 'Expected a single result from the right side',
        }
      }
      if (rhs.kind === EvaluationResultKind.ERROR) return rhs

      if (
        lhs.kind === EvaluationResultKind.NUMBER &&
        rhs.kind === EvaluationResultKind.NUMBER
      ) {
        switch (ast.operator) {
          // Math operators
          case BinaryExpressionOperator.EXPONENT:
            return functions.POWER(lhs, rhs)
          case BinaryExpressionOperator.MULTIPLY:
            return functions.MULTIPLY(lhs, rhs)
          case BinaryExpressionOperator.DIVIDE:
            return functions.DIVIDE(lhs, rhs)
          case BinaryExpressionOperator.ADD:
            return functions.SUM(lhs, rhs)
          case BinaryExpressionOperator.SUBTRACT:
            return functions.SUBTRACT(lhs, rhs)

          // Comparison operators
          case BinaryExpressionOperator.EQUALS:
            return lhs.value === rhs.value ? functions.TRUE() : functions.FALSE()
          case BinaryExpressionOperator.NOT_EQUALS:
            return lhs.value !== rhs.value ? functions.TRUE() : functions.FALSE()
          case BinaryExpressionOperator.LESS_THAN:
            return lhs.value < rhs.value ? functions.TRUE() : functions.FALSE()
          case BinaryExpressionOperator.LESS_THAN_EQUALS:
            return lhs.value <= rhs.value ? functions.TRUE() : functions.FALSE()
          case BinaryExpressionOperator.GREATER_THAN:
            return lhs.value > rhs.value ? functions.TRUE() : functions.FALSE()
          case BinaryExpressionOperator.GREATER_THAN_EQUALS:
            return lhs.value >= rhs.value ? functions.TRUE() : functions.FALSE()
          default:
            ast.operator satisfies never
        }
      }

      return {
        kind: EvaluationResultKind.ERROR,
        value: `Invalid operation, cannot use ${ast.operator} on ${lhs.kind} and ${rhs.kind}`,
      }
    }

    case AstKind.FUNCTION: {
      if (!Object.hasOwn(functions, ast.name)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: `Unknown function \`${ast.name}\``,
        }
      }

      let fn = functions[ast.name as keyof typeof functions]
      let args = ast.args.flatMap((arg) => evaluateExpression(arg, spreadsheet))

      // checking that here.
      return fn(...args)
    }
  }
}

export function printEvaluationResult(result: EvaluationResult): string {
  switch (result.kind) {
    case EvaluationResultKind.ERROR:
      return `ERROR: ${result.value}`
    case EvaluationResultKind.EMPTY:
      return ''
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
