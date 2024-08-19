import { stripVTControlCharacters } from 'node:util'
import Table from 'cli-table'
import { printEvaluationResult } from '~/domain/evaluation'
import { type Location, parseLocation, printLocation } from '~/domain/expression'
import { ComputationResultKind, type Spreadsheet } from '~/domain/spreadsheet'

export function visualizeSpreadsheet(spreadsheet: Spreadsheet) {
  let cells = spreadsheet.cellNames.map((cell) => parseLocation(cell))

  let first: Location = { row: Number.POSITIVE_INFINITY, col: Number.POSITIVE_INFINITY }
  let last: Location = { row: Number.NEGATIVE_INFINITY, col: Number.NEGATIVE_INFINITY }

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
      let cell = printLocation({ row: first.row + row, col: first.col + col })
      let result = spreadsheet.compute(cell)
      if (result === null) {
        output.push('')
      } else if (result.kind === ComputationResultKind.ERROR) {
        output.push(result.short)
        errors.push(`\u00B7 ${cell}: ${result.message}`)
      } else {
        output.push(printEvaluationResult(result.value))
      }
    }
    table.push(output)
  }

  return `\n${stripVTControlCharacters(table.toString())}\n${errors.length > 0 ? `\nErrors:\n\n${errors.join('\n')}\n` : ''}`
}
