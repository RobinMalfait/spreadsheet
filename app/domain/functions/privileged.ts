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
    referenceCellAST = structuredClone(referenceCellAST)

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
  },
)
