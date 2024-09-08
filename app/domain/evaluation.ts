import { format } from 'date-fns'
import {
  type AST,
  type AstFunction,
  AstKind,
  BinaryExpressionOperator,
} from '~/domain/ast'
import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import * as functions from '~/domain/functions'
import * as privilegedFunctions from '~/domain/functions/privileged'
import type { Spreadsheet } from '~/domain/spreadsheet'
import { expandRange } from '~/domain/walk-ast'

export interface Context {
  ast: AstFunction
  spreadsheet: Spreadsheet
  cell: string
}

export function evaluateExpression(
  ast: AST,
  spreadsheet: Spreadsheet,
  cell: string,
  returnFullValue = false,
): EvaluationResult | EvaluationResult[] | EvaluationResult[][] {
  switch (ast.kind) {
    case AstKind.EVALUATION_RESULT:
      return ast.value

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
      return spreadsheet.evaluate(ast.name, returnFullValue)

    case AstKind.RANGE: {
      let out = []
      for (let cell of expandRange(ast)) {
        let value = spreadsheet.evaluate(cell, returnFullValue)
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
      let lhs = evaluateExpression(ast.lhs, spreadsheet, cell, returnFullValue)
      if (Array.isArray(lhs)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: 'Expected a single result from the left side',
        }
      }
      if (lhs.kind === EvaluationResultKind.ERROR) return lhs

      let rhs = evaluateExpression(ast.rhs, spreadsheet, cell, returnFullValue)
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
      // Privileged functions are functions that have access to the spreadsheet.
      if (Object.hasOwn(privilegedFunctions, ast.name)) {
        let ctx: Context = {
          ast,
          spreadsheet,
          cell,
        }

        return privilegedFunctions[ast.name as keyof typeof privilegedFunctions](ctx)
      }

      if (!Object.hasOwn(functions, ast.name)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: `Unknown function \`${ast.name}\``,
        }
      }

      let fn = functions[ast.name as keyof typeof functions]
      let args = ast.args.flatMap((arg) => {
        if (arg?.kind === AstKind.EVALUATION_RESULT) {
          return arg.value
        }

        return evaluateExpression(arg, spreadsheet, cell, returnFullValue)
      })

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
