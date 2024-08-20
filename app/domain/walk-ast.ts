import { type AST, type AstCell, type AstCellRange, AstKind } from '~/domain/ast'
import { parseLocation } from '~/domain/expression'

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
            raw: cell,
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

export function* expandRange(range: AstCellRange) {
  for (let col = range.start.loc.col; col <= range.end.loc.col; col++) {
    for (let row = range.start.loc.row; row <= range.end.loc.row; row++) {
      yield `${String.fromCharCode(col + 65 - 1)}${row}`
    }
  }
}
