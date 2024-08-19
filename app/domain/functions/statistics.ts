import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation'

export function MIN(...args: EvaluationResult[]): EvaluationResult {
  let min = Number.POSITIVE_INFINITY

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        min = Math.min(min, arg.value)
        break
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.DATETIME:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: min }
}

export function MAX(...args: EvaluationResult[]): EvaluationResult {
  let max = Number.NEGATIVE_INFINITY

  for (let arg of args) {
    switch (arg.kind) {
      case EvaluationResultKind.NUMBER:
        max = Math.max(max, arg.value)
        break
      case EvaluationResultKind.BOOLEAN:
      case EvaluationResultKind.STRING:
      case EvaluationResultKind.DATETIME:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: max }
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
      case EvaluationResultKind.DATETIME:
        // Explicitly ignored
        break
      default:
        arg satisfies never
    }
  }

  let out = sum / count

  return { kind: EvaluationResultKind.NUMBER, value: out }
}
