import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'
import { ensureMatrix } from '~/utils/matrix'

export const DIGITS = expose(
  `
    @description A sequence of the digits from 0 through 9.
    @example JOIN(", ", DIGITS())
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

export const TRANSPOSE = expose(
  `
    @description Transpose an array.
    @param value The array to transpose.
    @example TRANSPOSE(DIGITS())
    TRANSPOSE(...value: T)
  `,
  // @ts-expect-error we are not really setup to use matrices yet
  (...value: EvaluationResult | EvaluationResult[] | EvaluationResult[][]) => {
    let matrix = ensureMatrix<EvaluationResult>(value)
    return matrix?.[0]?.map((_, i) => matrix.map((row) => row[i])) ?? []
  },
)
