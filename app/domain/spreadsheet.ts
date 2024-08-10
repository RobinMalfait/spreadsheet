import { segment } from '~/utils/segment'

type Cell = `${string}${number}`
type CellRange = `${Cell}:${Cell}`

type Argument = number | Cell | CellRange

function* expandRange(range: CellRange) {
  const [lhs, rhs] = segment(range, ':')
  const [, lhsCol, lhsRow] = /([A-Z]*)([0-9]*)/g.exec(lhs)!
  const [, rhsCol, rhsRow] = /([A-Z]*)([0-9]*)/g.exec(rhs)!

  const startCol = lhsCol.charCodeAt(0)
  const endCol = rhsCol.charCodeAt(0)

  const startRow = Number(lhsRow)
  const endRow = Number(rhsRow)

  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      yield `${String.fromCharCode(col)}${row}`
    }
  }
}

const functions = {
  SUM(spreadsheet: Spreadsheet, ...args: Argument[]) {
    let out = 0
    for (const arg of args) {
      if (!Number.isNaN(Number(arg))) {
        out += Number(arg)
      } else if (typeof arg === 'string' && arg.includes(':')) {
        for (const cell of expandRange(arg as CellRange)) {
          out += Number(spreadsheet.compute(cell))
        }
      } else {
        out += Number(spreadsheet.compute(arg as Cell))
      }
    }
    return out
  },
  PRODUCT(spreadsheet: Spreadsheet, ...args: Argument[]) {
    let out = 1
    for (const arg of args) {
      if (!Number.isNaN(Number(arg))) {
        out *= Number(arg)
      } else if (typeof arg === 'string' && arg.includes(':')) {
        for (const cell of expandRange(arg as CellRange)) {
          out *= Number(spreadsheet.compute(cell))
        }
      } else {
        out *= Number(spreadsheet.compute(arg as Cell))
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
  private fn: keyof typeof functions | null = null
  private args: Argument[] = []

  private constructor(private expression: string) {
    this.parse()
  }

  parse() {
    // @ts-expect-error todo
    const [, fn, args] = /^(.*?)\((.*?)\)$/.exec(this.expression)
    const argList = segment(args, ',')
    this.fn = fn
    this.args = argList as Argument[]
  }

  static of(expression: string) {
    return new Expression(expression)
  }

  text() {
    return this.expression
  }

  compute(spreadsheet: Spreadsheet) {
    if (this.fn === null) throw new Error('Invalid expression')
    if (!Object.hasOwn(functions, this.fn)) throw new Error('Invalid expression')

    return functions[this.fn](spreadsheet, ...this.args)
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
