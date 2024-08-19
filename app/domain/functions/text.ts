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
  delimiter: EvaluationResult,
  ...args: EvaluationResult[]
): EvaluationResult {
  if (delimiter.kind !== EvaluationResultKind.STRING) {
    throw Object.assign(
      new Error(`JOIN() expects a string as the delimiter, got ${delimiter.value}`),
      { short: '#VALUE!' },
    )
  }

  let out: string[] = []

  for (let arg of args) {
    out.push(printEvaluationResult(arg))
  }

  return { kind: EvaluationResultKind.STRING, value: out.join(delimiter.value) }
}

export function LOWER(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.DATETIME:
        out += printEvaluationResult(arg).toLowerCase()
        break
      case EvaluationResultKind.NUMBER:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  return { kind: EvaluationResultKind.STRING, value: out }
}

export function UPPER(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.DATETIME:
        out += printEvaluationResult(arg).toUpperCase()
        break
      case EvaluationResultKind.NUMBER:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  return { kind: EvaluationResultKind.STRING, value: out }
}
