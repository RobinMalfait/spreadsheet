import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation'

export function AS_NUMBER(
  value: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error(
      `AS_NUMBER() does not take more than one argument, got ${extra.value}`,
    )
  }

  switch (value.kind) {
    case EvaluationResultKind.NUMBER:
      return value

    case EvaluationResultKind.BOOLEAN:
      return { kind: EvaluationResultKind.NUMBER, value: value.value ? 1 : 0 }

    case EvaluationResultKind.DATETIME:
      return { kind: EvaluationResultKind.NUMBER, value: value.value.getTime() }

    case EvaluationResultKind.STRING: {
      let asNumber = Number(value.value)
      if (Number.isNaN(asNumber)) {
        throw new Error(`AS_NUMBER() expects a number, got ${value.value}`)
      }

      return { kind: EvaluationResultKind.NUMBER, value: asNumber }
    }

    default:
      value satisfies never
      return value
  }
}
