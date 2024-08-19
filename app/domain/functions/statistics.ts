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

export function MEDIAN(...args: EvaluationResult[]): EvaluationResult {
  let values = args
    .filter((arg) => arg.kind === EvaluationResultKind.NUMBER)
    .map((arg) => arg.value)
    .sort((a, z) => a - z)

  let n = values.length
  let mid = Math.floor(n / 2)

  if (n % 2 === 0) {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: (values[mid - 1] + values[mid]) / 2,
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: values[mid] }
}

export function MODE(...args: EvaluationResult[]): EvaluationResult {
  let maxCount = 0
  let mode = Number.NaN
  let counts = new Map<number, number>()

  for (let arg of args) {
    if (arg.kind === EvaluationResultKind.NUMBER) {
      let count = (counts.get(arg.value) || 0) + 1
      counts.set(arg.value, count)

      if (count > maxCount) {
        maxCount = count
        mode = arg.value
      }
    }
  }

  return { kind: EvaluationResultKind.NUMBER, value: mode }
}
