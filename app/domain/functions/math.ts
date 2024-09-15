import {
  type EvaluationResult,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'
import { flatten } from '~/utils/flatten'

export const PI = expose(
  `
    @description The number π.
    @example PI()
    PI()
  `,
  () => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.PI }
  },
)

export const TAU = expose(
  `
    @description The number τ.
    @example TAU()
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
      @description ${description ?? `The ${name} function.`}
      @param x A number.
      @example ${name}(1)
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
    @example ATAN2(1, 1)
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
    @example IMUL(1, 2)
    IMUL(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.imul(x.value, y.value) }
  },
)

export const SUM = expose(
  `
    @description Returns the sum of all arguments.
    @param values The numbers to sum.
    @example SUM(1, 2, 3)
    SUM(...values: T)
  `,
  (...values: EvaluationResult[]) => {
    let out = 0

    for (let arg of flatten(values)) {
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
    @description Add two numbers.
    @param x The first number.
    @param y The second number.
    @example ADD(1, 2)
    ADD(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: x.value + y.value }
  },
)

export const SUBTRACT = expose(
  `
    @description Subtract two numbers.
    @param x The first number.
    @param y The second number.
    @example SUBTRACT(2, 1)
    SUBTRACT(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: x.value - y.value }
  },
)

export const MULTIPLY = expose(
  `
    @description Multiply two numbers.
    @param x The first number.
    @param y The second number.
    @example MULTIPLY(2, 3)
    MULTIPLY(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: x.value * y.value }
  },
)

export const PRODUCT = expose(
  `
    @description Returns the product of all arguments.
    @param values The numbers to multiply.
    @example PRODUCT(2, 3, 4)
    PRODUCT(...values: T)
  `,
  (...values: EvaluationResult[]) => {
    let hasArgument = false
    let out = 1

    for (let arg of flatten(values)) {
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
    @description Returns the result of dividing two numbers.
    @param x The dividend.
    @param y The divisor.
    @example DIVIDE(6, 3)
    DIVIDE(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    if (y.value === 0) {
      return { kind: EvaluationResultKind.ERROR, value: 'DIVIDE() cannot divide by zero' }
    }

    return { kind: EvaluationResultKind.NUMBER, value: x.value / y.value }
  },
)

export const POWER = expose(
  `
    @description Returns the value of a base expression taken to a specified power.
    @param x The base value of the expression.
    @param y The exponent value of the expression.
    @example POWER(2, 3)
    POWER(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: x.value ** y.value }
  },
)

export const MOD = expose(
  `
    @description Returns the remainder of the division of two numbers.
    @param x The dividend.
    @param y The divisor.
    @example MOD(5, 2)
    MOD(x: NUMBER, y: NUMBER)
  `,
  (x: EvaluationResultNumber, y: EvaluationResultNumber) => {
    if (y.value === 0) {
      return { kind: EvaluationResultKind.ERROR, value: 'MOD() cannot mod by zero' }
    }

    return { kind: EvaluationResultKind.NUMBER, value: x.value % y.value }
  },
)

export const FLOOR = expose(
  `
    @description Returns the greatest integer less than or equal to its numeric argument.
    @param x A numeric expression.
    @example FLOOR(1.5)
    FLOOR(x: NUMBER)
  `,
  (x: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.floor(x.value) }
  },
)

export const CEIL = expose(
  `
    @description Returns the smallest integer greater than or equal to its numeric argument.
    @param x A numeric expression.
    @example CEIL(1.5)
    CEIL(x: NUMBER)
  `,
  (x: EvaluationResultNumber) => {
    return { kind: EvaluationResultKind.NUMBER, value: Math.ceil(x.value) }
  },
)

export const ROUND = expose(
  `
    @description Rounds a number to a certain number of decimal places.
    @param value The number to round.
    @param places The number of decimal places to round to.
    @example ROUND(1.5)
    @example ROUND(PI(), 2)
    ROUND(x: NUMBER, places?: NUMBER)
  `,
  (x: EvaluationResultNumber, places: EvaluationResultNumber) => {
    let decimals = places?.value ?? 0

    return {
      kind: EvaluationResultKind.NUMBER,
      value: Math.round(x.value * 10 ** decimals) / 10 ** decimals,
    }
  },
)
