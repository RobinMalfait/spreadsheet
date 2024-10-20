import { type AST, type AstEvaluationResult, AstKind } from '~/domain/ast'
import { evaluateExpression } from '~/domain/evaluation'
import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import { applyLocationDelta, locationDelta, parseLocation } from '~/domain/expression'
import { withSignature } from '~/domain/function-utils'
import * as functions from '~/domain/functions'
import { WalkAction, walk } from '~/domain/walk-ast'
import { ensureMatrix } from '~/utils/matrix'
import type { Signature } from '../signature/parser'
import { matchesTypes, tryCoerceValue } from '../type-checker'

function resolveTypesAt(args: Signature['args'], idx: number) {
  for (let [i, arg] of args.slice(0, idx + 1).entries()) {
    if (arg.variadic) {
      return arg.types.map((t) => `${t}[]`)
    }

    if (i === idx) {
      return arg.types
    }
  }

  return []
}

export const INTO = withSignature(
  `
    @description Try to coerce a value into the type expected by the function argument's type.
    INTO(value: T)
  `,
  (ctx) => {
    if (ctx.parent === undefined) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'INTO() can only be used inside of a function',
      }
    }

    let arg = ctx.ast.args[0]

    if (!arg || ctx.ast.args.length !== 1) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'INTO(value: T) Argument `value` was not provided',
      }
    }

    let fn = functions[ctx.parent.name as keyof typeof functions]
    let argTypes = fn.signature.args

    let types = resolveTypesAt(argTypes, ctx.parent.idx)
    let myValue = evaluateExpression(arg, ctx.spreadsheet, ctx.cell)

    return matchesTypes(myValue, types) ? myValue : tryCoerceValue(myValue, types)
  },
)

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

export const VALUE = withSignature(
  `
    @description Get the value of the current position in a matrix. Only works inside of a \`MAP()\`.
    @internal
    VALUE()
  `,
  (ctx) => {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'VALUE() can only be used inside of a MAP() function',
    }
  },
)

export const OFFSET_ROW = withSignature(
  `
    @description Get the current row number of the value in the matrix. Only works inside of a \`MAP()\`.
    @internal
    OFFSET_ROW()
  `,
  (ctx) => {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'OFFSET_ROW() can only be used inside of a MAP() function',
    }
  },
)

export const OFFSET_COL = withSignature(
  `
    @description Get the current col number of the value in the matrix. Only works inside of a \`MAP()\`.
    @internal
    OFFSET_COL()
  `,
  (ctx) => {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'OFFSET_COL() can only be used inside of a MAP() function',
    }
  },
)

export const MAP = withSignature(
  `
    @description Map a list of values using a lambda function.
    @example MAP(DIGITS(), VALUE() * 2)
    MAP(list: T, lambda: Expression)
  `,
  (ctx) => {
    if (ctx.ast.args.length !== 2) {
      return { kind: EvaluationResultKind.ERROR, value: 'Expected two arguments' }
    }

    let inputAst = ctx.ast.args[0]
    if (!inputAst) {
      return { kind: EvaluationResultKind.ERROR, value: 'Expected a list' }
    }

    let lambda = ctx.ast.args[1]
    if (!lambda) {
      return { kind: EvaluationResultKind.ERROR, value: 'Expected an expression' }
    }

    let rows = ensureMatrix(evaluateExpression(inputAst, ctx.spreadsheet, ctx.cell, true))

    return rows.map((cols, rowIdx) => {
      return cols.map((value, colIdx) => {
        // Fresh copy of the lambda function such that we can replace `VALUE()`
        // with the current `value`.
        let fn = JSON.parse(JSON.stringify(lambda)) as AstEvaluationResult

        // Replace all instances of `VALUE()` with the current value.
        walk([fn], (node) => {
          if (node.kind === AstKind.FUNCTION && node.name === 'VALUE') {
            // Promote `VALUE()` to the current value
            Object.assign(node, {
              kind: AstKind.EVALUATION_RESULT,
              value: value,
            })
          } else if (node.kind === AstKind.FUNCTION && node.name === 'OFFSET_ROW') {
            Object.assign(node, {
              kind: AstKind.EVALUATION_RESULT,
              value: { kind: EvaluationResultKind.NUMBER, value: rowIdx },
            })
          } else if (node.kind === AstKind.FUNCTION && node.name === 'OFFSET_COL') {
            Object.assign(node, {
              kind: AstKind.EVALUATION_RESULT,
              value: { kind: EvaluationResultKind.NUMBER, value: colIdx },
            })
          }

          return WalkAction.Continue
        })

        return evaluateExpression(fn, ctx.spreadsheet, ctx.cell)
      })
    })
  },
)
