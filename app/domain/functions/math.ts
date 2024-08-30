import {
  type EvaluationResult,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const PI = expose('PI()', {
  description: 'The number π',
  handle() {
    return { kind: EvaluationResultKind.NUMBER, value: Math.PI }
  },
})

export const TAU = expose('TAU()', {
  description: 'The number τ',
  handle() {
    return { kind: EvaluationResultKind.NUMBER, value: 2 * Math.PI }
  },
})

function exposeUnaryMathFunction(
  name: string,
  fn: (input: number) => number,
  description?: string,
) {
  return expose(`${name}(x: NUMBER)`, {
    description: description ?? `The ${name} function`,
    handle(arg: EvaluationResultNumber): EvaluationResult {
      return { kind: EvaluationResultKind.NUMBER, value: fn(arg.value) }
    },
  })
}

export const ABS = exposeUnaryMathFunction('ABS', Math.abs)
export const ACOS = exposeUnaryMathFunction('ACOS', Math.acos)
export const ACOSH = exposeUnaryMathFunction('ACOSH', Math.acosh)
export const ASIN = exposeUnaryMathFunction('ASIN', Math.asin)
export const ASINH = exposeUnaryMathFunction('ASINH', Math.asinh)
export const ATAN = exposeUnaryMathFunction('ATAN', Math.atan)
export const ATANH = exposeUnaryMathFunction('ATANH', Math.atanh)
export const CBRT = exposeUnaryMathFunction('CBRT', Math.cbrt)
export const CLZ32 = exposeUnaryMathFunction('CLZ32', Math.clz32)
export const COS = exposeUnaryMathFunction('COS', Math.cos)
export const COSH = exposeUnaryMathFunction('COSH', Math.cosh)
export const EXP = exposeUnaryMathFunction('EXP', Math.exp)
export const LOG = exposeUnaryMathFunction('LOG', Math.log)
export const LOG10 = exposeUnaryMathFunction('LOG10', Math.log10)
export const SIN = exposeUnaryMathFunction('SIN', Math.sin)
export const SINH = exposeUnaryMathFunction('SINH', Math.sinh)
export const SQRT = exposeUnaryMathFunction('SQRT', Math.sqrt)
export const TAN = exposeUnaryMathFunction('TAN', Math.tan)
export const TANH = exposeUnaryMathFunction('TANH', Math.tanh)
export const TRUNC = exposeUnaryMathFunction('TRUNC', Math.trunc)

export const ATAN2 = expose(
  // @describe y A numeric expression representing the cartesian y-coordinate.
  // @describe x A numeric expression representing the cartesian x-coordinate.
  'ATAN2(y: NUMBER, x: NUMBER)',
  {
    description: 'The angle (in radians) from the X axis to a point.',
    handle(y: EvaluationResultNumber, x: EvaluationResultNumber) {
      return { kind: EvaluationResultKind.NUMBER, value: Math.atan2(y.value, x.value) }
    },
  },
)

export const IMUL = expose('IMUL(x: NUMBER, y: NUMBER)', {
  description: 'The result of 32-bit multiplication of two numbers.',
  handle(x: EvaluationResultNumber, y: EvaluationResultNumber) {
    return { kind: EvaluationResultKind.NUMBER, value: Math.imul(x.value, y.value) }
  },
})

export const SUM = expose('SUM(...args: T)', {
  description: 'Returns the sum of all arguments',
  handle(...args: EvaluationResult[]) {
    let out = 0

    for (let arg of args) {
      switch (arg.kind) {
        case EvaluationResultKind.ERROR:
          return arg
        case EvaluationResultKind.NUMBER:
          out += arg.value
          break
        case EvaluationResultKind.EMPTY:
        case EvaluationResultKind.BOOLEAN:
        case EvaluationResultKind.STRING:
        case EvaluationResultKind.DATETIME:
          // Explicitly ignored
          break
        default:
          arg satisfies never
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: out }
  },
})

export const ADD = expose('ADD(lhs: NUMBER, rhs: NUMBER)', {
  description: 'Add two numbers',
  handle(lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value + rhs.value }
  },
})

export const SUBTRACT = expose('SUBTRACT(lhs: NUMBER, rhs: NUMBER)', {
  description: 'Subtract two numbers',
  handle(lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value - rhs.value }
  },
})

export const MULTIPLY = expose('MULTIPLY(lhs: NUMBER, rhs: NUMBER)', {
  description: 'Multiply two numbers',
  handle(lhs: EvaluationResultNumber, rhs: EvaluationResultNumber): EvaluationResult {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value * rhs.value }
  },
})

export const PRODUCT = expose('PRODUCT(...args: T)', {
  description: 'Returns the product of all arguments',
  handle(...args: EvaluationResult[]): EvaluationResult {
    let hasArgument = false
    let out = 1

    for (let arg of args) {
      switch (arg.kind) {
        case EvaluationResultKind.ERROR:
          return arg
        case EvaluationResultKind.NUMBER:
          hasArgument = true
          out *= arg.value
          break
        case EvaluationResultKind.EMPTY:
        case EvaluationResultKind.STRING:
        case EvaluationResultKind.BOOLEAN:
        case EvaluationResultKind.DATETIME:
          // Explicitly ignored
          break
        default:
          arg satisfies never
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: hasArgument ? out : 0 }
  },
})

export const DIVIDE = expose('DIVIDE(lhs: NUMBER, rhs: NUMBER)', {
  description: 'Divide the lhs by the rhs',
  handle(lhs: EvaluationResultNumber, rhs: EvaluationResultNumber): EvaluationResult {
    if (rhs.value === 0) {
      return { kind: EvaluationResultKind.ERROR, value: 'DIVIDE() cannot divide by zero' }
    }

    return { kind: EvaluationResultKind.NUMBER, value: lhs.value / rhs.value }
  },
})

export const POWER = expose('POWER(lhs: NUMBER, rhs: NUMBER)', {
  description: 'Power the lhs by the rhs',
  handle(lhs: EvaluationResultNumber, rhs: EvaluationResultNumber): EvaluationResult {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value ** rhs.value }
  },
})

export const MOD = expose('MOD(lhs: NUMBER, rhs: NUMBER)', {
  description: 'Mod the lhs by the rhs',
  handle(lhs: EvaluationResultNumber, rhs: EvaluationResultNumber): EvaluationResult {
    if (rhs.value === 0) {
      return { kind: EvaluationResultKind.ERROR, value: 'MOD() cannot mod by zero' }
    }

    return { kind: EvaluationResultKind.NUMBER, value: lhs.value % rhs.value }
  },
})

export const FLOOR = expose('FLOOR(value: NUMBER)', {
  description: 'Floor the number',
  handle(value: EvaluationResultNumber): EvaluationResult {
    return { kind: EvaluationResultKind.NUMBER, value: Math.floor(value.value) }
  },
})

export const CEIL = expose('CEIL(value: NUMBER)', {
  description: 'Ceil the number',
  handle(value: EvaluationResultNumber): EvaluationResult {
    return { kind: EvaluationResultKind.NUMBER, value: Math.ceil(value.value) }
  },
})

export const ROUND = expose('ROUND(value: NUMBER, places?: NUMBER)', {
  description: 'Ceil the number',
  handle(
    value: EvaluationResultNumber,
    places: EvaluationResultNumber,
  ): EvaluationResult {
    let decimals = places?.value ?? 0

    return {
      kind: EvaluationResultKind.NUMBER,
      value: Math.round(value.value * 10 ** decimals) / 10 ** decimals,
    }
  },
})
