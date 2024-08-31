import { EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const DIGITS = expose(
  `
    @description A sequence of the digits from 0 through 9

    DIGITS()
  `,
  () => {
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
  },
)
