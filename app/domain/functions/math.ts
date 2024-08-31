import {
  type EvaluationResult,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const PI = expose(
  `
    @description The number π
    PI()
  `,
  () => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.PI }
  },
)

export const TAU = expose(
  `
    @description The number τ
    TAU()
  `,
  () => {
    return { kind: EvaluationResultKind.NUMBER, value: 2 * Math.PI }
  },
)

function exposeUnaryMathFunction(
  name: string,
  fn: (input: number) => number,
  description?: string,
) {
  return expose(
    `
      @description ${description ?? `The ${name} function`}
      @param x A numeric expression
      ${name}(x: NUMBER)
    `,
    (arg: EvaluationResultNumber) => {
      return { kind: EvaluationResultKind.NUMBER, value: fn(arg.value) }
    },
  )
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
  `
    @description The angle (in radians) from the X axis to a point.
    @param y A numeric expression representing the cartesian y-coordinate.
    @param x A numeric expression representing the cartesian x-coordinate.
    ATAN2(y: NUMBER, x: NUMBER)
  `,
  (y: EvaluationResultNumber, x: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.atan2(y.value, x.value) }
  },
)

export const IMUL = expose(
  `
    @description The result of 32-bit multiplication of two numbers.
    @param x First number
    @param y Second number
    IMUL(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.imul(x.value, y.value) }
  },
)

export const SUM = expose(
  `
    @description Returns the sum of all arguments
    SUM(...args: T)
  `,
  (...args: EvaluationResult[]) => {
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
)

export const ADD = expose(
  `
    @description Add two numbers
    ADD(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value + rhs.value }
  },
)

export const SUBTRACT = expose(
  `
    @description Subtract two numbers
    SUBTRACT(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value - rhs.value }
  },
)

export const MULTIPLY = expose(
  `
    @description Multiply two numbers
    MULTIPLY(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value * rhs.value }
  },
)

export const PRODUCT = expose(
  `
    @description Returns the product of all arguments
    PRODUCT(...args: T)
  `,
  (...args: EvaluationResult[]) => {
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
)

export const DIVIDE = expose(
  `
    @description Divide the lhs by the rhs
    DIVIDE(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    if (rhs.value === 0) {
      return { kind: EvaluationResultKind.ERROR, value: 'DIVIDE() cannot divide by zero' }
    }

    return { kind: EvaluationResultKind.NUMBER, value: lhs.value / rhs.value }
  },
)

export const POWER = expose(
  `
    @description Power the lhs by the rhs
    POWER(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: lhs.value ** rhs.value }
  },
)

export const MOD = expose(
  `
    @description Mod the lhs by the rhs
    MOD(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    if (rhs.value === 0) {
      return { kind: EvaluationResultKind.ERROR, value: 'MOD() cannot mod by zero' }
    }

    return { kind: EvaluationResultKind.NUMBER, value: lhs.value % rhs.value }
  },
)

export const FLOOR = expose(
  `
    @description Floor the number
    FLOOR(value: NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.floor(value.value) }
  },
)

export const CEIL = expose(
  `
    @description Ceil the number
    CEIL(value: NUMBER)
  `,
  (value: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.ceil(value.value) }
  },
)

export const ROUND = expose(
  `
    @description Round the number
    ROUND(value: NUMBER, places?: NUMBER)
  `,
  (value: EvaluationResultNumber, places: EvaluationResultNumber) => {
    let decimals = places?.value ?? 0

    return {
      kind: EvaluationResultKind.NUMBER,
      value: Math.round(value.value * 10 ** decimals) / 10 ** decimals,
    }
  },
)
