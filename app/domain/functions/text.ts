import {
  type EvaluationResult,
  EvaluationResultKind,
  printEvaluationResult,
} from '~/domain/evaluation'

export function CONCAT(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    out += printEvaluationResult(arg)
  }

  return { kind: EvaluationResultKind.STRING, value: out }
}

export function JOIN(
  delimiter?: EvaluationResult,
  ...args: EvaluationResult[]
): EvaluationResult {
  if (delimiter?.kind !== EvaluationResultKind.STRING) {
    throw Object.assign(
      new Error(
        `JOIN() expects a string as the delimiter, got ${delimiter?.value ?? '<nothing>'}`,
      ),
      { short: '#VALUE!' },
    )
  }

  let out: string[] = []

  for (let arg of args) {
    out.push(printEvaluationResult(arg))
  }

  return { kind: EvaluationResultKind.STRING, value: out.join(delimiter.value) }
}

export function LOWER(
  arg?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw Object.assign(
      new Error(`LOWER() does not take more than one argument, got ${extra.value}`),
      { short: '#VALUE!' },
    )
  }

  if (!arg) {
    throw Object.assign(
      new Error('LOWER() expects a value as the first argument, got <nothing>'),
      { short: '#N/A' },
    )
  }

  return {
    kind: EvaluationResultKind.STRING,
    value: printEvaluationResult(arg).toLowerCase(),
  }
}

export function UPPER(
  arg?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw Object.assign(
      new Error(`UPPER() does not take more than one argument, got ${extra.value}`),
      { short: '#VALUE!' },
    )
  }

  if (!arg) {
    throw Object.assign(
      new Error('UPPER() expects a value as the first argument, got <nothing>'),
      { short: '#N/A' },
    )
  }

  return {
    kind: EvaluationResultKind.STRING,
    value: printEvaluationResult(arg).toLowerCase(),
  }
}
