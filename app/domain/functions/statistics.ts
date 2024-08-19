import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation'

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
