import { type AST, AstKind } from '~/domain/ast'
import {
  type EvaluationResult,
  EvaluationResultKind,
  evaluateExpression,
} from '~/domain/evaluation'
import { parse } from '~/domain/expression'
import * as functions from '~/domain/functions'
import { tokenize } from '~/domain/tokenizer'
import { WalkAction, walk } from '~/domain/walk-ast'
import { DefaultMap } from '~/utils/default-map'

export class Spreadsheet {
  // Track each individual cell and it's contents. AST is pre-parsed.
  #cells = new Map<string, [raw: string, ast: AST]>()

  // Track formatting for each cell
  #formatting = new Map<string, AST>()

  // Track all dependencies for each cell.
  #dependencies = new Map<string, Set<string>>()

  #evaluationCache = new Map<string, EvaluationResult | null>()

  get cellNames() {
    return Array.from(this.#cells.keys())
  }

  has(cell: string): boolean {
    return this.#cells.has(cell)
  }

  get(cell: string): string {
    let result = this.#cells.get(cell)
    if (result) {
      return result[0]
    }
    return ''
  }

  set(
    cell: string,
    value: string,
  ): Extract<EvaluationResult, { kind: EvaluationResultKind.ERROR }> | null {
    // Reset state
    this.#cells.delete(cell)

    // Clear existing dependencies for this cell
    let dependencies = this.#dependencies.get(cell)
    if (dependencies) dependencies.clear()
    else dependencies = new Set()

    // Clear the full evaluation cache. Very naive, but let's re-compute
    // everything the moment _something_ changes.
    this.#evaluationCache.clear()

    // Value must be filled in
    if (value.trim() === '') return null

    // Expression should exist
    let expression = value[0] === '=' ? value.slice(1) : `"${value}"`
    if (expression.trim() === '') return null

    try {
      let tokens = tokenize(expression)
      let ast = parse(tokens)

      // Track all references in the AST
      walk([ast], (node) => {
        if (node.kind === AstKind.CELL) {
          dependencies.add(node.name)
        }

        return WalkAction.Continue
      })

      this.#cells.set(cell, [value, ast])

      // Save dependencies
      if (dependencies.size > 0) this.#dependencies.set(cell, dependencies)

      return null
    } catch (err: unknown) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: (err as Error).message,
      }
    }
  }

  functions() {
    let collator = new Intl.Collator('en', { sensitivity: 'base' })
    return Object.keys(functions).sort(collator.compare)
  }

  dependencies(cell: string): Set<string> {
    return new Set(this.#dependencies.get(cell))
  }

  evaluate(cell: string): EvaluationResult {
    let result = this.#cells.get(cell)
    if (!result) return { kind: EvaluationResultKind.EMPTY, value: '<empty>' }

    let cached = this.#evaluationCache.get(cell)
    if (cached) return cached

    // TODO: Should this be moved to the `set` method?
    if (result[1].kind === AstKind.RANGE) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'Cannot reference a range to a cell',
      }
    }

    // Verify references
    let dependencies = this.#dependencies.get(cell)
    if (dependencies && dependencies.size > 0) {
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
          return {
            kind: EvaluationResultKind.ERROR,
            value: `Circular reference detected in cell ${previous}`,
          }
        }

        if (this.#cells.has(next)) {
          // Track where we came from
          previous = next

          // Check transitive dependencies
          let transitiveDependencies = this.#dependencies.get(next)
          if (!transitiveDependencies) continue

          for (let other of transitiveDependencies) {
            if (!handled.has(other)) {
              todo.push(other)
            }
          }
        }
      }
    }

    let out = evaluateExpression(result[1], this)
    if (Array.isArray(out)) {
      out = {
        kind: EvaluationResultKind.ERROR,
        value: 'Expected a single result',
      }
    }
    this.#evaluationCache.set(cell, out)
    return out
  }
}
