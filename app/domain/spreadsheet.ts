import { type AST, AstKind } from '~/domain/ast'
import { type EvaluationResult, evaluateExpression } from '~/domain/evaluation'
import { parse } from '~/domain/expression'
import * as functions from '~/domain/functions'
import { tokenize } from '~/domain/tokenizer'
import { WalkAction, walk } from '~/domain/walk-ast'
import { DefaultMap } from '~/utils/default-map'

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

  get cellNames() {
    return Array.from(this.cells.keys())
  }

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
    let ast = parse(tokens)

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
          // biome-ignore lint/style/noNonNullAssertion: we already verified that the evaluationResult has at least one element.
          value: evaluationResult[0]!,
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
