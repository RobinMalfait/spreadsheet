import { stripVTControlCharacters } from 'node:util'
import Table from 'cli-table'
import { printEvaluationResult } from '~/domain/evaluation'
import { EvaluationResultKind } from '~/domain/evaluation-result'
import { type Location, parseLocation, printLocation } from '~/domain/expression'
import type { Signature } from '~/domain/signature/parser'
import { Spreadsheet } from '~/domain/spreadsheet'

export async function exampleTests(functions: Record<string, { signature: Signature }>) {
  let { describe, expect, it } = await import('vitest')

  describe('`@example` tests', () => {
    for (let [name, { signature }] of Object.entries(functions)) {
      let examples = signature.tags
        .filter((x) => x.kind === 'example')
        .map((x) => x.value)

      if (examples.length > 1) {
        describe(name, () => {
          it.each(examples)('%s', (example) => {
            let spreadsheet = new Spreadsheet()
            spreadsheet.set('A1', `=${example}`)
            expect(visualizeSpreadsheet(spreadsheet)).toMatchSnapshot()
          })
        })
      } else {
        it.each(examples)('%s', (example) => {
          let spreadsheet = new Spreadsheet()
          spreadsheet.set('A1', `=${example}`)
          expect(visualizeSpreadsheet(spreadsheet)).toMatchSnapshot()
        })
      }
    }
  })
}

export function visualizeSpreadsheet(spreadsheet: Spreadsheet) {
  // Evaluate known cells (not spilled). This will ensure that not-yet evaluated
  // cells are evaluated (aka, spilled cells).
  for (let cell of spreadsheet.cellNames) {
    spreadsheet.evaluate(cell)
  }

  let cells = spreadsheet.cellNames.map((cell) => parseLocation(cell))

  let first: Location = {
    row: Number.POSITIVE_INFINITY,
    col: Number.POSITIVE_INFINITY,
    lock: 0,
  }
  let last: Location = {
    row: Number.NEGATIVE_INFINITY,
    col: Number.NEGATIVE_INFINITY,
    lock: 0,
  }

  // Figure out the grid size
  for (let cell of cells) {
    first.row = Math.min(first.row, cell.row)
    first.col = Math.min(first.col, cell.col)
    last.row = Math.max(last.row, cell.row)
    last.col = Math.max(last.col, cell.col)
  }

  // Ensure we have at least one cell
  if (first.row === Number.POSITIVE_INFINITY) {
    first.row = 0
  }
  if (first.col === Number.POSITIVE_INFINITY) {
    first.col = 0
  }
  if (last.row === Number.NEGATIVE_INFINITY) {
    last.row = 0
  }
  if (last.col === Number.NEGATIVE_INFINITY) {
    last.col = 0
  }

  let rows = last.row - first.row + 1
  let cols = last.col - first.col + 1

  // Generate the grid
  let table = new Table()

  // Add the header
  table.push([
    '',
    ...Array.from({ length: cols }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)),
  ])

  let errors = []
  for (let row = 0; row < rows; row++) {
    let output = [`${row + 1}`]
    for (let col = 0; col < cols; col++) {
      let cell = printLocation({
        row: first.row + row,
        col: first.col + col,
        lock: 0,
      })
      let result = spreadsheet.evaluate(cell)
      if (result.kind === EvaluationResultKind.ERROR) {
        output.push('Error')
        errors.push(`\u00B7 ${cell}: ${result.value}`)
      } else {
        output.push(
          // Wrap strings in quotes if they are formulas. Or, if they originate
          // from a spilled cell. If it's a string literal, we don't need to
          // wrap it in quotes.
          result?.kind === EvaluationResultKind.STRING &&
            (spreadsheet.get(cell)[0] === '=' || // Formula
              spreadsheet.spillDependencies(cell).size > 0) // Spilled
            ? `"${printEvaluationResult(result)}"`
            : printEvaluationResult(result),
        )
      }
    }
    table.push(output)
  }

  return `\n${stripVTControlCharacters(table.toString())}\n${errors.length > 0 ? `\nErrors:\n\n${errors.join('\n')}\n` : ''}`
}
