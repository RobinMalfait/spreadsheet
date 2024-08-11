import {
  type AST,
  type AstCellRange,
  AstKind,
  parseExpression,
  tokenizeExpression,
} from './expression'

function* expandRange(range: AstCellRange) {
  for (let col = range.start.loc.col; col <= range.end.loc.col; col++) {
    for (let row = range.start.loc.row; row <= range.end.loc.row; row++) {
      yield `${String.fromCharCode(col + 65 - 1)}${row}`
    }
  }
}

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

type EvaluationResult =
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
        throw new Error(`Unknown function: ${ast.name}`)
      }

      let fn = functions[ast.name as keyof typeof functions]
      let args = ast.args.flatMap((arg) => evaluateExpression(arg, spreadsheet))
      let result = fn(...args)
      return [result]
    }
  }
}

export class Spreadsheet {
  private cells: Map<string, [raw: string, ast: AST]> = new Map()

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
      return
    }

    let expression = value[0] === '=' ? value.slice(1) : `"${value}"`
    let tokens = tokenizeExpression(expression)
    let ast = parseExpression(tokens)

    this.cells.set(cell, [value, ast])
  }

  compute(cell: string): number | string | null {
    let evaluationResult = this.evaluate(cell)
    if (evaluationResult.length > 1) {
      throw new Error(`Expected a single result, got ${evaluationResult.length}`)
    }

    if (evaluationResult.length === 1) {
      return evaluationResult[0].value
    }

    return null
  }

  evaluate(cell: string): EvaluationResult[] {
    let result = this.cells.get(cell)
    if (result) {
      return evaluateExpression(result[1], this)
    }
    return []
  }
}
