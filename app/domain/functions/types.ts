import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation'

export function AS_NUMBER(
  value?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (value === undefined) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'AS_NUMBER() expects a value as the first argument, got <nothing>',
    }
  }

  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `AS_NUMBER() does not take more than one argument, got ${extra.value}`,
    }
  }

  switch (value.kind) {
    // No need to convert an error to a number
    case EvaluationResultKind.ERROR:
    // No need to convert a number to a number
    case EvaluationResultKind.NUMBER:
    // We can't convert an empty value to a number. We could return 0, which
    // helps in places like `SUM(…)`. But if you use `PRODUCT(…)`, we want 1
    // instead. Not enough context to make a decision here.
    case EvaluationResultKind.EMPTY:
      return value

    case EvaluationResultKind.BOOLEAN:
      return { kind: EvaluationResultKind.NUMBER, value: value.value ? 1 : 0 }

    case EvaluationResultKind.DATETIME:
      return { kind: EvaluationResultKind.NUMBER, value: value.value.getTime() }

    case EvaluationResultKind.STRING: {
      let asNumber = Number(value.value)
      if (Number.isNaN(asNumber)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: `AS_NUMBER() expects a number, got ${value.value}`,
        }
      }

      return { kind: EvaluationResultKind.NUMBER, value: asNumber }
    }

    default:
      value satisfies never
      return value
  }
}
