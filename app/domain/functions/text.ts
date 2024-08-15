import { type EvaluationResult, EvaluationResultKind } from '../spreadsheet'

export function CONCAT(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        out += arg.value.toString()
        break
      case EvaluationResultKind.STRING:
        out += arg.value
        break
      case EvaluationResultKind.BOOLEAN:
        out += arg.string
        break
      default:
        arg satisfies never
    }
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
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        out.push(arg.value.toString())
        break
      case EvaluationResultKind.STRING:
        out.push(arg.value)
        break
      case EvaluationResultKind.BOOLEAN:
        out.push(arg.string)
        break
      default:
        arg satisfies never
    }
  }

  return { kind: EvaluationResultKind.STRING, value: out.join(delimiter.value) }
}

export function LOWER(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.STRING:
        out += arg.value.toLowerCase()
        break
      case EvaluationResultKind.BOOLEAN:
        out += arg.string.toLowerCase()
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
        out += arg.value.toUpperCase()
        break
      case EvaluationResultKind.BOOLEAN:
        out += arg.string.toUpperCase()
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
