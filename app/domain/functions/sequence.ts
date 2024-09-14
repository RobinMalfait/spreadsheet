import {
  type EvaluationResult,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'
import { ensureMatrix } from '~/utils/matrix'

export const DIGITS = expose(
  `
    @description A sequence of the digits from 0 through 9.
    @example DIGITS()
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

export const RANGE = expose(
  `
    @description Generate a sequence of numbers from start to end.
    @example RANGE(3, 7)
    @example RANGE(10)
    RANGE(min: NUMBER, max?: NUMBER)
  `,
  (min: EvaluationResultNumber, max?: EvaluationResultNumber) => {
    if (!max) {
      max = min
      min = { kind: EvaluationResultKind.NUMBER, value: 0 }
    }
    let out: EvaluationResultNumber[] = []
    for (let i = min.value; i < max.value; i++) {
      out.push({ kind: EvaluationResultKind.NUMBER, value: i })
    }
    return out
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

export const MATRIX = expose(
  `
    @description Create a matrix of size rows x cols. With an optional default value.
    @param rows The number of rows in the matrix.
    @param cols The number of columns in the matrix.
    @param fill The default value for each cell in the matrix.
    @example MATRIX(4, 5, 3)
    MATRIX(rows: NUMBER, cols: NUMBER, fill: T)
  `,
  // @ts-expect-error we are not really setup to use matrices yet
  (
    rows: EvaluationResultNumber,
    cols: EvaluationResultNumber,
    value: EvaluationResult,
  ) => {
    return Array.from({ length: rows.value }).map(() =>
      Array.from({ length: cols.value }).fill(value),
    )
  },
)
