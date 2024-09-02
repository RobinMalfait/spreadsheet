import { type AST, AstKind } from '~/domain/ast'
import { evaluateExpression } from '~/domain/evaluation'
import { EvaluationResultKind } from '~/domain/evaluation-result'
import { applyLocationDelta, locationDelta, parseLocation } from '~/domain/expression'
import { withSignature } from '~/domain/function-utils'
import { WalkAction, walk } from '~/domain/walk-ast'

export const INHERIT_FORMULA = withSignature(
  `
    @description Inherit a formula from another cell. References to other cells in the formula will be updated to be relative to the current cell.
    INHERIT_FORMULA(cell: CELL)
  `,
  (ctx) => {
    if (ctx.ast.args[0]?.kind !== AstKind.CELL) {
      return { kind: EvaluationResultKind.ERROR, value: 'Expected a cell reference' }
    }

    let referenceCell = ctx.ast.args[0]
    let currentCell = parseLocation(ctx.cell)
    let delta = locationDelta(referenceCell.loc, currentCell)

    let referenceCellAST = ctx.spreadsheet.getAST(referenceCell.name)
    if (!referenceCellAST) return { kind: EvaluationResultKind.EMPTY, value: '' }
    try {
      // Inheriting a formula from a cell that itself has the `INHERIT_FORMULA`
      // function should proxy through to the cell that the reference cell is
      // inheriting from.
      if (
        referenceCellAST.kind === AstKind.FUNCTION &&
        referenceCellAST.name === 'INHERIT_FORMULA'
      ) {
        return evaluateExpression(referenceCellAST, ctx.spreadsheet, ctx.cell)
      }

      // Clone the reference cell AST so we don't modify the original
      referenceCellAST = JSON.parse(JSON.stringify(referenceCellAST)) as AST

      // Update all cell references in the cloned AST to make them relative to the
      // current cell.
      walk([referenceCellAST], (node) => {
        if (node.kind === AstKind.CELL) {
          applyLocationDelta(node, delta)
        }

        if (node.kind === AstKind.RANGE) {
          applyLocationDelta(node.start, delta)
          applyLocationDelta(node.end, delta)
        }

        return WalkAction.Continue
      })

      return evaluateExpression(referenceCellAST, ctx.spreadsheet, ctx.cell)
    } catch (e) {
      // TODO: Properly detect circular references here…
      return {
        kind: EvaluationResultKind.ERROR,
        value: `Circular reference detected in cell ${ctx.cell}`,
      }
    }
  },
)

export const ROW = withSignature(
  `
    @description Get the row number of a cell. If no cell is provided, the current cell will be used.
    @example ROW()
    @example ROW(B3)
    ROW(cell?: CELL)
  `,
  (ctx) => {
    let location =
      ctx.ast.args[0]?.kind === AstKind.CELL
        ? ctx.ast.args[0].loc
        : parseLocation(ctx.cell)

    return {
      kind: EvaluationResultKind.NUMBER,
      value: location.row,
    }
  },
)

export const COL = withSignature(
  `
    @description Get the col number of a cell. If no cell is provided, the current cell will be used.
    @example COL()
    @example COL(B3)
    COL(cell?: CELL)
  `,
  (ctx) => {
    let location =
      ctx.ast.args[0]?.kind === AstKind.CELL
        ? ctx.ast.args[0].loc
        : parseLocation(ctx.cell)

    return {
      kind: EvaluationResultKind.NUMBER,
      value: location.col,
    }
  },
)
