import { DefaultMap } from '~/utils/default-map'
import {
  type AST,
  type AstCell,
  type AstCellRange,
  AstKind,
  parseExpression,
  parseLocation,
  tokenizeExpression,
} from './expression'

const functions = {
  // Text functions
  CONCAT(...args: EvaluationResult[]): EvaluationResult {
    let out = ''

    for (let arg of args) {
      if (arg.kind === EvaluationResultKind.NUMBER) {
        out += arg.value.toString()
      } else if (arg.kind === EvaluationResultKind.STRING) {
        out += arg.value
      }
    }

    return { kind: EvaluationResultKind.STRING, value: out }
  },
  LOWER(...args: EvaluationResult[]): EvaluationResult {
    let out = ''

    for (let arg of args) {
      if (arg.kind === EvaluationResultKind.STRING) {
        out += arg.value.toLowerCase()
      }
    }

    return { kind: EvaluationResultKind.STRING, value: out }
  },
  UPPER(...args: EvaluationResult[]): EvaluationResult {
    let out = ''

    for (let arg of args) {
      if (arg.kind === EvaluationResultKind.STRING) {
        out += arg.value.toUpperCase()
      }
    }

    return { kind: EvaluationResultKind.STRING, value: out }
  },

  // Math functions
  PI(...args: EvaluationResult[]): EvaluationResult {
    if (args.length > 0) {
      throw Object.assign(new Error('PI() does not take any arguments'), {
        short: '#VALUE!',
      })
    }

    return { kind: EvaluationResultKind.NUMBER, value: Math.PI }
  },
  SUM(...args: EvaluationResult[]): EvaluationResult {
    let out = 0

    for (let arg of args) {
      if (arg.kind === EvaluationResultKind.NUMBER) {
        out += arg.value
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: out }
  },
  PRODUCT(...args: EvaluationResult[]): EvaluationResult {
    let out = 1

    for (let arg of args) {
      if (arg.kind === EvaluationResultKind.NUMBER) {
        out *= arg.value
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: out }
  },
  AVERAGE(...args: EvaluationResult[]): EvaluationResult {
    let sum = 0
    let count = 0

    for (let arg of args) {
      if (arg.kind === EvaluationResultKind.NUMBER) {
        count += 1
        sum += arg.value
      }
    }

    let out = sum / count

    return { kind: EvaluationResultKind.NUMBER, value: out }
  },
}

enum EvaluationResultKind {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
}

export type EvaluationResult =
  | { kind: EvaluationResultKind.NUMBER; value: number }
  | { kind: EvaluationResultKind.STRING; value: string }

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
        out.push(...spreadsheet.evaluate(cell))
      }
      return out
    }

    case AstKind.FUNCTION: {
      if (!Object.hasOwn(functions, ast.name)) {
        throw Object.assign(new Error(`Unknown function: ${ast.name}`), {
          short: '#NAME?',
        })
      }

      let fn = functions[ast.name as keyof typeof functions]
      let args = ast.args.flatMap((arg) => evaluateExpression(arg, spreadsheet))
      let result = fn(...args)
      return [result]
    }
  }
}

export enum ComputationResultKind {
  VALUE = 'VALUE',
  ERROR = 'ERROR',
}

export enum ComputationValueKind {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
}

type ComputationValue = {
  kind: ComputationResultKind.VALUE
  value:
    | { kind: ComputationValueKind.NUMBER; value: number }
    | { kind: ComputationValueKind.STRING; value: string }
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
  private dependencies = new DefaultMap<string, Set<string>>(() => new Set<string>())

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
    if (value.trim() === '') {
      this.cells.delete(cell)
      this.dependencies.delete(cell)
      return
    }

    let expression = value[0] === '=' ? value.slice(1) : `"${value}"`
    let tokens = tokenizeExpression(expression)
    let ast = parseExpression(tokens)

    let dependencies = this.dependencies.get(cell)

    // Clear existing dependencies for this cell
    dependencies.clear()

    // Track all references in the AST
    walk([ast], (node) => {
      if (node.kind === AstKind.CELL) {
        dependencies.add(node.name)
      }

      return WalkAction.Continue
    })

    this.cells.set(cell, [value, ast])
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
          value:
            evaluationResult[0].kind === EvaluationResultKind.NUMBER
              ? { kind: ComputationValueKind.NUMBER, value: evaluationResult[0].value }
              : { kind: ComputationValueKind.STRING, value: evaluationResult[0].value },
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
    if (result) {
      // TODO: Should this be moved to the `set` method?
      if (result[1].kind === AstKind.RANGE) {
        throw Object.assign(new Error('Cannot reference a range to a cell'), {
          short: '#VALUE!',
        })
      }

      // Verify references
      let dependencies = this.dependencies.get(cell)
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
            for (let other of this.dependencies.get(next)) {
              if (!handled.has(other)) {
                todo.push(other)
              }
            }
          }
        }
      }

      return evaluateExpression(result[1], this)
    }

    return []
  }
}

enum WalkAction {
  /** Continue walking, which is the default */
  Continue = 0,

  /** Skip visiting the children of this node */
  Skip = 1,

  /** Stop the walk entirely */
  Stop = 2,
}

function walk(ast: AST[], visit: (node: AST) => WalkAction): WalkAction {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let status = visit(node)

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
          }

          if (walk([cellNode], visit) === WalkAction.Stop) {
            return WalkAction.Stop
          }
        }
        break

      case AstKind.FUNCTION:
        if (walk(node.args, visit) === WalkAction.Stop) {
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
