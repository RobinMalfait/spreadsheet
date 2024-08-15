import { type EvaluationResult, EvaluationResultKind } from '../spreadsheet'

export function PI(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    throw Object.assign(new Error('PI() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: Math.PI }
}

export function SUM(...args: EvaluationResult[]): EvaluationResult {
  let out = 0

  for (let arg of args) {
    if (arg.kind === EvaluationResultKind.NUMBER) {
      out += arg.value
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function PRODUCT(...args: EvaluationResult[]): EvaluationResult {
  let out = 1

  for (let arg of args) {
    if (arg.kind === EvaluationResultKind.NUMBER) {
      out *= arg.value
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: out }
}

export function AVERAGE(...args: EvaluationResult[]): EvaluationResult {
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
