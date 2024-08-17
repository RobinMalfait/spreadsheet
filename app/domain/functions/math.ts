import { type EvaluationResult, EvaluationResultKind } from '../spreadsheet'

export function PI(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    throw Object.assign(new Error('PI() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: Math.PI }
}

export function TAU(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    throw Object.assign(new Error('TAU() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: 2 * Math.PI }
}

function exposeMathFunction(name: string, fn: (input: number) => number) {
  return (arg: EvaluationResult): EvaluationResult => {
    if (arg.kind !== EvaluationResultKind.NUMBER) {
      throw Object.assign(new Error(`${name}() expects a number, got ${arg.value}`), {
        short: '#VALUE!',
      })
    }

    return { kind: EvaluationResultKind.NUMBER, value: fn(arg.value) }
  }
}

export const ABS = exposeMathFunction('ABS', Math.abs)
export const ACOS = exposeMathFunction('ACOS', Math.acos)
export const ACOSH = exposeMathFunction('ACOSH', Math.acosh)
export const ASIN = exposeMathFunction('ASIN', Math.asin)
export const ASINH = exposeMathFunction('ASINH', Math.asinh)
export const ATAN = exposeMathFunction('ATAN', Math.atan)
export const ATANH = exposeMathFunction('ATANH', Math.atanh)
export const CBRT = exposeMathFunction('CBRT', Math.cbrt)
export const COS = exposeMathFunction('COS', Math.cos)
export const COSH = exposeMathFunction('COSH', Math.cosh)
export const EXP = exposeMathFunction('EXP', Math.exp)
export const LOG = exposeMathFunction('LOG', Math.log)
export const LOG10 = exposeMathFunction('LOG10', Math.log10)
export const SIN = exposeMathFunction('SIN', Math.sin)
export const SINH = exposeMathFunction('SINH', Math.sinh)
export const SQRT = exposeMathFunction('SQRT', Math.sqrt)
export const TAN = exposeMathFunction('TAN', Math.tan)
export const TANH = exposeMathFunction('TANH', Math.tanh)

export function SUM(...args: EvaluationResult[]): EvaluationResult {
  let out = 0

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        out += arg.value
        break
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.DATE:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function SUBTRACT(...args: EvaluationResult[]): EvaluationResult {
  let out: number | null = null

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        if (out === null) {
          out = arg.value
        } else {
          out -= arg.value
        }
        break
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.DATE:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  if (out === null) {
    throw Object.assign(new Error('SUBTRACT() requires at least one argument'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function MULTIPLY(
  lhs: EvaluationResult,
  rhs: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw Object.assign(
      new Error(`MULTIPLY() does not take a third argument, got ${extra.value}`),
      { short: '#VALUE!' },
    )
  }

  if (lhs.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`MULTIPLY() expects a number as the first argument, got ${lhs.value}`),
      { short: '#VALUE!' },
    )
  }

  if (rhs.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`MULTIPLY() expects a number as the second argument, got ${rhs.value}`),
      { short: '#VALUE!' },
    )
  }

  let out = lhs.value * rhs.value

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function PRODUCT(...args: EvaluationResult[]): EvaluationResult {
  let out = 1

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        out *= arg.value
        break
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.DATE:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function DIVIDE(lhs: EvaluationResult, rhs: EvaluationResult): EvaluationResult {
  if (lhs.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`DIVIDE() expects a number as the dividend, got ${lhs.value}`),
      {
        short: '#VALUE!',
      },
    )
  }

  if (rhs.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`DIVIDE() expects a number as the divisor, got ${rhs.value}`),
      {
        short: '#VALUE!',
      },
    )
  }

  if (rhs.value === 0) {
    throw Object.assign(new Error('DIVIDE() cannot divide by zero'), { short: '#DIV/0!' })
  }

  let out = lhs.value / rhs.value

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function AVERAGE(...args: EvaluationResult[]): EvaluationResult {
  let sum = 0
  let count = 0

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        count += 1
        sum += arg.value
        break
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.DATE:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  let out = sum / count

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function MOD(num: EvaluationResult, divisor: EvaluationResult): EvaluationResult {
  if (num.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`MOD() expects a number as the number, got ${num.value}`),
      { short: '#VALUE!' },
    )
  }

  if (divisor.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`MOD() expects a number as the divisor, got ${num.value}`),
      { short: '#VALUE!' },
    )
  }

  if (divisor.value === 0) {
    throw Object.assign(new Error('MOD() cannot divide by zero'), { short: '#DIV/0!' })
  }

  let out = num.value % divisor.value

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function FLOOR(
  arg: EvaluationResult,
  other: EvaluationResult | undefined,
): EvaluationResult {
  if (other !== undefined) {
    throw Object.assign(
      new Error(`FLOOR() does not take a second argument, got ${other.value}`),
      { short: '#VALUE!' },
    )
  }

  if (arg.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`FLOOR() expects a number as the first argument, got ${arg.value}`),
      { short: '#VALUE!' },
    )
  }

  return { kind: EvaluationResultKind.NUMBER, value: Math.floor(arg.value) }
}

export function CEIL(
  arg: EvaluationResult,
  other: EvaluationResult | undefined,
): EvaluationResult {
  if (other !== undefined) {
    throw Object.assign(
      new Error(`CEIL() does not take a second argument, got ${other.value}`),
      { short: '#VALUE!' },
    )
  }

  if (arg.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`CEIL() expects a number as the first argument, got ${arg.value}`),
      { short: '#VALUE!' },
    )
  }

  return { kind: EvaluationResultKind.NUMBER, value: Math.ceil(arg.value) }
}

export function ROUND(
  arg: EvaluationResult,
  other: EvaluationResult | undefined,
): EvaluationResult {
  if (other !== undefined) {
    throw Object.assign(
      new Error(`ROUND() does not take a second argument, got ${other.value}`),
      { short: '#VALUE!' },
    )
  }

  if (arg.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(
      new Error(`ROUND() expects a number as the first argument, got ${arg.value}`),
      { short: '#VALUE!' },
    )
  }

  return { kind: EvaluationResultKind.NUMBER, value: Math.round(arg.value) }
}
