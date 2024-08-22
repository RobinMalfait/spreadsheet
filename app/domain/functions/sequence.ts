import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation'

export function DIGITS(extra?: EvaluationResult): EvaluationResult | EvaluationResult[] {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'DIGITS() does not take any arguments',
    }
  }

  return [
    { kind: EvaluationResultKind.NUMBER, value: 0 },
    { kind: EvaluationResultKind.NUMBER, value: 1 },
    { kind: EvaluationResultKind.NUMBER, value: 2 },
    { kind: EvaluationResultKind.NUMBER, value: 3 },
    { kind: EvaluationResultKind.NUMBER, value: 4 },
    { kind: EvaluationResultKind.NUMBER, value: 5 },
    { kind: EvaluationResultKind.NUMBER, value: 6 },
    { kind: EvaluationResultKind.NUMBER, value: 7 },
    { kind: EvaluationResultKind.NUMBER, value: 8 },
    { kind: EvaluationResultKind.NUMBER, value: 9 },
  ]
}
