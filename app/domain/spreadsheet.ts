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
  CONCAT(spreadsheet: Spreadsheet, ...args: AST[]) {
    let out = ''
    for (let arg of args) {
      if (arg.kind === AstKind.NUMBER_LITERAL) {
        out += arg.value
      } else if (arg.kind === AstKind.STRING_LITERAL) {
        out += arg.value
      } else if (arg.kind === AstKind.FUNCTION && Object.hasOwn(functions, arg.name)) {
        out += functions[arg.name as keyof typeof functions](spreadsheet, ...arg.args)
      } else if (arg.kind === AstKind.CELL) {
        out += Number(spreadsheet.compute(arg.name))
      } else if (arg.kind === AstKind.RANGE) {
        for (let cell of expandRange(arg as AstCellRange)) {
          out += Number(spreadsheet.compute(cell))
        }
      }
    }
    return out
  },
  SUM(spreadsheet: Spreadsheet, ...args: AST[]) {
    let out = 0

    for (let arg of args) {
      if (arg.kind === AstKind.NUMBER_LITERAL) {
        out += arg.value
      } else if (arg.kind === AstKind.FUNCTION && Object.hasOwn(functions, arg.name)) {
        let result = functions[arg.name as keyof typeof functions](
          spreadsheet,
          ...arg.args,
        )
        if (typeof result === 'number') {
          out += result
        }
      } else if (arg.kind === AstKind.CELL) {
        out += Number(spreadsheet.compute(arg.name))
      } else if (arg.kind === AstKind.RANGE) {
        for (let cell of expandRange(arg as AstCellRange)) {
          out += Number(spreadsheet.compute(cell))
        }
      }
    }

    return out
  },
  PRODUCT(spreadsheet: Spreadsheet, ...args: AST[]) {
    let out = 1

    for (let arg of args) {
      if (arg.kind === AstKind.NUMBER_LITERAL) {
        out *= arg.value
      } else if (arg.kind === AstKind.FUNCTION && Object.hasOwn(functions, arg.name)) {
        let result = functions[arg.name as keyof typeof functions](
          spreadsheet,
          ...arg.args,
        )
        if (typeof result === 'number') {
          out += result
        }
      } else if (arg.kind === AstKind.CELL) {
        out *= Number(spreadsheet.compute(arg.name))
      } else if (arg.kind === AstKind.RANGE) {
        for (let cell of expandRange(arg as AstCellRange)) {
          out *= Number(spreadsheet.compute(cell))
        }
      }
    }

    return out
  },
}

export class Value {
  private constructor(private value: number) {}

  static of(value: number) {
    return new Value(value)
  }

  text() {
    return this.value
  }

  compute() {
    return this.value
  }
}

export class Expression {
  private ast: AST | null = null

  private constructor(private expression: string) {
    let tokens = tokenizeExpression(expression)
    let ast = parseExpression(tokens)
    this.ast = ast
  }

  static of(expression: string) {
    return new Expression(expression)
  }

  text() {
    return this.expression
  }

  compute(spreadsheet: Spreadsheet) {
    if (!this.ast) throw new Error('Invalid expression')

    // TODO: Evaluate all expressions

    if (this.ast.kind !== AstKind.FUNCTION) {
      throw new Error('Invalid expression, expected function')
    }

    if (!Object.hasOwn(functions, this.ast.name)) {
      throw new Error('Invalid expression, expected function')
    }

    return functions[this.ast.name as keyof typeof functions](
      spreadsheet,
      ...this.ast.args,
    )
  }
}

export class Spreadsheet {
  private cells: Map<string, Value | Expression> = new Map()

  get(cell: string) {
    return this.cells.get(cell)?.text()
  }

  compute(cell: string) {
    return this.cells.get(cell)?.compute(this)
  }

  set(cell: string, value: Value | Expression) {
    this.cells.set(cell, value)
  }
}
