import { DefaultMap } from '~/utils/default-map'
import {
  type AST,
  type AstCell,
  type AstCellRange,
  AstKind,
  BinaryExpressionOperator,
  parseExpression,
  parseLocation,
} from './expression'
import * as functions from './functions'
import { tokenize } from './tokenizer'

export enum EvaluationResultKind {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
}

export type EvaluationResult =
  | { kind: EvaluationResultKind.NUMBER; value: number }
  | { kind: EvaluationResultKind.STRING; value: string }
  | { kind: EvaluationResultKind.BOOLEAN; value: boolean; string: 'TRUE' | 'FALSE' }
  | { kind: EvaluationResultKind.DATE; value: Date }

function evaluateExpression(ast: AST, spreadsheet: Spreadsheet): EvaluationResult[] {
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
        throw Object.assign(new Error('Expected a single result from each side'), {
          short: '#VALUE!',
        })
      }

      let left = lhs[0]
      let right = rhs[0]

      if (
        left.kind === EvaluationResultKind.NUMBER &&
        right.kind === EvaluationResultKind.NUMBER
      ) {
        switch (ast.operator) {
          case BinaryExpressionOperator.ADD:
            return [functions.SUM(left, right)]
          case BinaryExpressionOperator.SUBTRACT:
            return [functions.SUBTRACT(left, right)]
          case BinaryExpressionOperator.MULTIPLY:
            return [functions.MULTIPLY(left, right)]
          case BinaryExpressionOperator.DIVIDE:
            return [functions.DIVIDE(left, right)]
          case BinaryExpressionOperator.EQUALS:
            return left.value === right.value ? [functions.TRUE()] : [functions.FALSE()]
          case BinaryExpressionOperator.LESS_THAN:
            return left.value < right.value ? [functions.TRUE()] : [functions.FALSE()]
          case BinaryExpressionOperator.GREATER_THAN:
            return left.value > right.value ? [functions.TRUE()] : [functions.FALSE()]
          default:
            ast.operator satisfies never
        }
      }

      throw Object.assign(new Error(`Invalid operation \`${ast.kind}\``), {
        short: '#VALUE!',
      })
    }

    case AstKind.FUNCTION: {
      if (!Object.hasOwn(functions, ast.name)) {
        throw Object.assign(new Error(`Unknown function \`${ast.name}\``), {
          short: '#NAME?',
        })
      }

      let fn = functions[ast.name as keyof typeof functions]
      let args = ast.args.flatMap((arg) => evaluateExpression(arg, spreadsheet))
      // @ts-expect-error Some functions have a different arity, but we're not
      // checking that here.
      let result = fn(...args)
      return [result]
    }
  }
}

export enum ComputationResultKind {
  VALUE = 'VALUE',
  ERROR = 'ERROR',
}

type ComputationValue = {
  kind: ComputationResultKind.VALUE
  value: EvaluationResult
}

type ComputationError = {
  kind: ComputationResultKind.ERROR
  short: string
  message: string
}

export class Spreadsheet {
  // Track each individual cell and it's contents. AST is pre-parsed.
  private cells = new Map<string, [raw: string, ast: AST]>()

  // Track all dependencies for each cell.
  private _dependencies = new DefaultMap<string, Set<string>>(() => new Set<string>())

  private evaluationCache = new Map<string, EvaluationResult[]>()

  has(cell: string): boolean {
    return this.cells.has(cell)
  }

  get(cell: string): string {
    let result = this.cells.get(cell)
    if (result) {
      return result[0]
    }
    return ''
  }

  set(cell: string, value: string) {
    // Reset state
    this.cells.delete(cell)

    // Clear existing dependencies for this cell
    let dependencies = this._dependencies.get(cell)
    dependencies.clear()

    // Clear the full evaluation cache. Very naive, but let's re-compute
    // everything the moment _something_ changes.
    this.evaluationCache.clear()

    // Value must be filled in
    if (value.trim() === '') return

    // Expression should exist
    let expression = value[0] === '=' ? value.slice(1) : `"${value}"`
    if (expression.trim() === '') return

    let tokens = tokenize(expression)
    let ast = parseExpression(tokens)

    // Track all references in the AST
    walk([ast], (node) => {
      if (node.kind === AstKind.CELL) {
        dependencies.add(node.name)
      }

      return WalkAction.Continue
    })

    this.cells.set(cell, [value, ast])
  }

  functions() {
    let collator = new Intl.Collator('en', { sensitivity: 'base' })
    return Object.keys(functions).sort(collator.compare)
  }

  dependencies(cell: string): Set<string> {
    return new Set(this._dependencies.get(cell))
  }

  compute(cell: string): ComputationValue | ComputationError | null {
    try {
      let evaluationResult = this.evaluate(cell)
      if (evaluationResult.length > 1) {
        throw Object.assign(
          new Error(`Expected a single result, got ${evaluationResult.length}`),
          { short: '#VALUE!' },
        )
      }

      if (evaluationResult.length === 1) {
        return {
          kind: ComputationResultKind.VALUE,
          value: evaluationResult[0],
        }
      }

      return null
    } catch (err: unknown) {
      return {
        kind: ComputationResultKind.ERROR,
        // @ts-expect-error This is fine…
        short: err?.short ?? 'Error',
        message: (err as Error).message,
      }
    }
  }

  evaluate(cell: string): EvaluationResult[] {
    let result = this.cells.get(cell)
    if (!result) return []

    let cached = this.evaluationCache.get(cell)
    if (cached) return cached

    // TODO: Should this be moved to the `set` method?
    if (result[1].kind === AstKind.RANGE) {
      throw Object.assign(new Error('Cannot reference a range to a cell'), {
        short: '#VALUE!',
      })
    }

    // Verify references
    let dependencies = this._dependencies.get(cell)
    if (dependencies.size > 0) {
      let handled = new Set<string>()
      let todo = Array.from(dependencies)

      // Track where we came from
      let previous = cell

      while (todo.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: We verified that there is at least a single element in the while condition above.
        let next = todo.shift()!

        // No need to re-verify cells we've already handled
        if (handled.has(next)) continue
        handled.add(next)

        if (next === cell) {
          throw Object.assign(
            new Error(`Circular reference detected in cell ${previous}`),
            { short: '#REF!' },
          )
        }

        if (this.cells.has(next)) {
          // Track where we came from
          previous = next

          // Check transitive dependencies
          for (let other of this._dependencies.get(next)) {
            if (!handled.has(other)) {
              todo.push(other)
            }
          }
        }
      }
    }

    let out = evaluateExpression(result[1], this)
    this.evaluationCache.set(cell, out)
    return out
  }
}

export enum WalkAction {
  /** Continue walking, which is the default */
  Continue = 0,

  /** Skip visiting the children of this node */
  Skip = 1,

  /** Stop the walk entirely */
  Stop = 2,
}

export function walk(
  ast: AST[],
  visit: (node: AST, parent: AST | null, depth: number) => WalkAction,
  parent: AST | null = null,
  depth = 0,
): WalkAction {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let status = visit(node, parent, depth)

    // Stop the walk entirely
    if (status === WalkAction.Stop) return status

    // Skip visiting the children of this node
    if (status === WalkAction.Skip) continue

    switch (node.kind) {
      case AstKind.CELL:
      case AstKind.NUMBER_LITERAL:
      case AstKind.STRING_LITERAL:
        break

      case AstKind.RANGE:
        for (let cell of expandRange(node)) {
          let cellNode: AstCell = {
            kind: AstKind.CELL,
            name: cell,
            loc: parseLocation(cell),
            span: node.span,
          }

          if (walk([cellNode], visit, node, depth + 1) === WalkAction.Stop) {
            return WalkAction.Stop
          }
        }
        break

      case AstKind.FUNCTION:
        if (walk(node.args, visit, node, depth + 1) === WalkAction.Stop) {
          return WalkAction.Stop
        }
        break

      case AstKind.BINARY_EXPRESSION:
        if (walk([node.lhs, node.rhs], visit, node, depth + 1) === WalkAction.Stop) {
          return WalkAction.Stop
        }
        break

      default:
        // @ts-expect-error This should never happen. If it does, let's crash.
        throw new Error(`Unknown AST node kind: ${node.kind}`)
    }
  }

  return WalkAction.Continue
}

function* expandRange(range: AstCellRange) {
  for (let col = range.start.loc.col; col <= range.end.loc.col; col++) {
    for (let row = range.start.loc.row; row <= range.end.loc.row; row++) {
      yield `${String.fromCharCode(col + 65 - 1)}${row}`
    }
  }
}
