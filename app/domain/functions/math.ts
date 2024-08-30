import {
  type EvaluationResult,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const PI = expose('PI', {
  args: [],
  description: 'The number π',
  handle: () => ({ kind: EvaluationResultKind.NUMBER, value: Math.PI }),
})

export const TAU = expose('TAU', {
  args: [],
  description: 'The number τ',
  handle: () => ({ kind: EvaluationResultKind.NUMBER, value: 2 * Math.PI }),
})

function exposeUnaryMathFunction(
  name: string,
  fn: (input: number) => number,
  description?: string,
) {
  return expose(name, {
    args: [
      {
        kind: EvaluationResultKind.NUMBER,
        name: 'x',
        description: 'The number to operate on',
      },
    ],
    description: description ?? `The ${name} function`,
    handle: (arg: EvaluationResultNumber) => ({
      kind: EvaluationResultKind.NUMBER,
      value: fn(arg.value),
    }),
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

export const ATAN2 = expose('ATAN2', {
  args: [
    {
      kind: EvaluationResultKind.NUMBER,
      name: 'y',
      description: 'A numeric expression representing the cartesian y-coordinate.',
    },
    {
      kind: EvaluationResultKind.NUMBER,
      name: 'x',
      description: 'A numeric expression representing the cartesian x-coordinate.',
    },
  ],
  description: 'The angle (in radians) from the X axis to a point.',
  handle: (y: EvaluationResultNumber, x: EvaluationResultNumber) => ({
    kind: EvaluationResultKind.NUMBER,
    value: Math.atan2(y.value, x.value),
  }),
})
export const IMUL = expose('IMUL', {
  args: [
    { kind: EvaluationResultKind.NUMBER, name: 'x', description: 'First number' },
    { kind: EvaluationResultKind.NUMBER, name: 'y', description: 'Second number' },
  ],
  description: 'The result of 32-bit multiplication of two numbers.',
  handle: (x: EvaluationResultNumber, y: EvaluationResultNumber) => ({
    kind: EvaluationResultKind.NUMBER,
    value: Math.imul(x.value, y.value),
  }),
})

export function SUM(...args: EvaluationResult[]): EvaluationResult {
  if (args.length === 0) {
    return { kind: EvaluationResultKind.NUMBER, value: 0 }
  }

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
}

export function ADD(
  lhs?: EvaluationResult,
  rhs?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `ADD() does not take a third argument, got ${extra.value}`,
    }
  }

  if (lhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `ADD() expects a number as the first argument, got ${lhs?.value ?? '<nothing>'}`,
    }
  }

  if (rhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `ADD() expects a number as the second argument, got ${rhs?.value ?? '<nothing>'}`,
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: lhs.value + rhs.value }
}

export function SUBTRACT(
  lhs?: EvaluationResult,
  rhs?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `SUBTRACT() does not take a third argument, got ${extra.value}`,
    }
  }

  if (lhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `SUBTRACT() expects a number as the first argument, got ${lhs?.value ?? '<nothing>'}`,
    }
  }

  if (rhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `SUBTRACT() expects a number as the second argument, got ${rhs?.value ?? '<nothing>'}`,
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: lhs.value - rhs.value }
}

export function MULTIPLY(
  lhs?: EvaluationResult,
  rhs?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `MULTIPLY() does not take a third argument, got ${extra.value}`,
    }
  }

  if (lhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `MULTIPLY() expects a number as the first argument, got ${lhs?.value ?? '<nothing>'}`,
    }
  }

  if (rhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `MULTIPLY() expects a number as the second argument, got ${rhs?.value ?? '<nothing>'}`,
    }
  }

  let out = lhs.value * rhs.value

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function PRODUCT(...args: EvaluationResult[]): EvaluationResult {
  if (args.length === 0) {
    return { kind: EvaluationResultKind.NUMBER, value: 0 }
  }

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
}

export function DIVIDE(
  lhs?: EvaluationResult,
  rhs?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `DIVIDE() does not take a third argument, got ${extra.value}`,
    }
  }

  if (lhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `DIVIDE() expects a number as the dividend, got ${lhs?.value ?? '<nothing>'}`,
    }
  }

  if (rhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `DIVIDE() expects a number as the divisor, got ${rhs?.value ?? '<nothing>'}`,
    }
  }

  if (rhs.value === 0) {
    return { kind: EvaluationResultKind.ERROR, value: 'DIVIDE() cannot divide by zero' }
  }

  let out = lhs.value / rhs.value

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function POWER(
  lhs?: EvaluationResult,
  rhs?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `POWER() does not take a third argument, got ${extra.value}`,
    }
  }

  if (lhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `POWER() expects a number as the base, got ${lhs?.value ?? '<nothing>'}`,
    }
  }

  if (rhs?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `POWER() expects a number as the exponent, got ${rhs?.value ?? '<nothing>'}`,
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: lhs.value ** rhs.value }
}

export function MOD(
  num?: EvaluationResult,
  divisor?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `MOD() does not take a third argument, got ${extra.value}`,
    }
  }

  if (num === undefined || divisor === undefined) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `MOD() requires two arguments, got ${[num, divisor].filter(Boolean).length}`,
    }
  }

  if (num.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `MOD() expects a number as the number, got ${num.value}`,
    }
  }

  if (divisor.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `MOD() expects a number as the divisor, got ${num.value}`,
    }
  }

  if (divisor.value === 0) {
    return { kind: EvaluationResultKind.ERROR, value: 'MOD() cannot divide by zero' }
  }

  let out = num.value % divisor.value

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function FLOOR(
  arg?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `FLOOR() does not take a second argument, got ${extra.value}`,
    }
  }

  if (arg?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `FLOOR() expects a number as the first argument, got ${arg?.value ?? '<nothing>'}`,
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: Math.floor(arg.value) }
}

export function CEIL(arg?: EvaluationResult, extra?: EvaluationResult): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `CEIL() does not take a second argument, got ${extra.value}`,
    }
  }

  if (arg?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `CEIL() expects a number as the first argument, got ${arg?.value ?? '<nothing>'}`,
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: Math.ceil(arg.value) }
}

export function ROUND(
  arg?: EvaluationResult,
  places?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `ROUND() does not take a third argument, got ${extra.value}`,
    }
  }

  if (arg?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `ROUND() expects a number as the first argument, got ${arg?.value ?? '<nothing>'}`,
    }
  }

  if (places !== undefined && places.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `ROUND() expects a number as the second argument, got ${places.value}`,
    }
  }

  let decimals = places?.value ?? 0

  return {
    kind: EvaluationResultKind.NUMBER,
    value: Math.round(arg.value * 10 ** decimals) / 10 ** decimals,
  }
}
