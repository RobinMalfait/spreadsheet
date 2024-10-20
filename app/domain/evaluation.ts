import { format } from 'date-fns'
import {
  type AST,
  type AstFunction,
  AstKind,
  BinaryExpressionOperator,
} from '~/domain/ast'
import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import { printLocation } from '~/domain/expression'
import * as functions from '~/domain/functions'
import * as intrinsicFunctions from '~/domain/functions/intrinsics'
import type { Spreadsheet } from '~/domain/spreadsheet'

export interface Context {
  ast: AstFunction
  spreadsheet: Spreadsheet
  cell: string
  parent?: { name: string; idx: number }
}

export function evaluateExpression(
  ast: AST,
  spreadsheet: Spreadsheet,
  cell: string,
  returnFullValue = false,
  parent?: { name: string; idx: number },
): EvaluationResult | EvaluationResult[] | EvaluationResult[][] {
  switch (ast.kind) {
    case AstKind.EVALUATION_RESULT:
      return ast.value

    case AstKind.NUMBER_LITERAL:
      return { kind: EvaluationResultKind.NUMBER, value: ast.value }

    case AstKind.STRING_LITERAL:
      return { kind: EvaluationResultKind.STRING, value: ast.value }

    case AstKind.CELL: {
      let out = spreadsheet.evaluate(ast.name, returnFullValue)
      return out
    }

    case AstKind.RANGE: {
      let matrix: EvaluationResult[][] = []

      let offsetCol = ast.start.loc.col
      let offsetRow = ast.start.loc.row

      for (let col = ast.start.loc.col; col <= ast.end.loc.col; col++) {
        for (let row = ast.start.loc.row; row <= ast.end.loc.row; row++) {
          let cell = printLocation({ col, row, lock: 0 })

          let result = spreadsheet.evaluate(cell, false)
          if (Array.isArray(result)) {
            return {
              kind: EvaluationResultKind.ERROR,
              value: 'Cannot evaluate a range with multiple results',
            }
          }

          matrix[row - offsetRow] ??= []
          // @ts-expect-error We just defaulted to an array above, so we know
          // it's defined.
          matrix[row - offsetRow][col - offsetCol] = result
        }
      }

      return matrix
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
      if (Object.hasOwn(intrinsicFunctions, ast.name)) {
        let ctx: Context = {
          ast,
          spreadsheet,
          cell,
          parent,
        }

        return intrinsicFunctions[ast.name as keyof typeof intrinsicFunctions](ctx)
      }

      if (!Object.hasOwn(functions, ast.name)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: `Unknown function \`${ast.name}\``,
        }
      }

      let fn = functions[ast.name as keyof typeof functions]
      let args = ast.args.map((arg, idx) => {
        if (arg?.kind === AstKind.EVALUATION_RESULT) {
          return arg.value
        }

        return evaluateExpression(arg, spreadsheet, cell, returnFullValue, {
          name: ast.name,
          idx,
        })
      })

      // @ts-expect-error Each function has a different number of arguments, but
      // everything is typed and will be checked at runtime.
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
