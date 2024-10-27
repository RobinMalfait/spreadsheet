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
    return '0123456789'.split('').map((c) => ({
      kind: EvaluationResultKind.NUMBER,
      value: Number(c),
    }))
  },
)

export const HEX_DIGITS = expose(
  `
    @description A sequence of the digits from 0 through 9 and A through F.
    @example HEX_DIGITS()
    HEX_DIGITS()
  `,
  () => {
    return '0123456789abcdefABCDEF'.split('').map((c) => ({
      kind: EvaluationResultKind.STRING,
      value: c,
    }))
  },
)

export const OCT_DIGITS = expose(
  `
    @description A sequence of the digits from 0 through 7
    @example OCT_DIGITS()
    OCT_DIGITS()
  `,
  () => {
    return '01234567'.split('').map((c) => ({
      kind: EvaluationResultKind.NUMBER,
      value: Number(c),
    }))
  },
)

export const ASCII_LETTERS = expose(
  `
    @description A sequence of ascii letters from a through z and A through Z.
    @example ASCII_LETTERS()
    ASCII_LETTERS()
  `,
  () => {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c) => ({
      kind: EvaluationResultKind.STRING,
      value: c,
    }))
  },
)

export const ASCII_LETTERS_LOWERCASE = expose(
  `
    @description A sequence of ascii letters from a through z
    @example ASCII_LETTERS_LOWERCASE()
    ASCII_LETTERS_LOWERCASE()
  `,
  () => {
    return 'abcdefghijklmnopqrstuvwxyz'.split('').map((c) => ({
      kind: EvaluationResultKind.STRING,
      value: c,
    }))
  },
)

export const ASCII_LETTERS_UPPERCASE = expose(
  `
    @description A sequence of ascii letters from A through Z
    @example ASCII_LETTERS_UPPERCASE()
    ASCII_LETTERS_UPPERCASE()
  `,
  () => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c) => ({
      kind: EvaluationResultKind.STRING,
      value: c,
    }))
  },
)

export const RANGE = expose(
  `
    @description Generate a sequence of numbers from start to end.
    @example RANGE(3, 7)
    @example RANGE(10)
    RANGE(min: NUMBER, max?: NUMBER)
  `,
  (min: EvaluationResultNumber, max: EvaluationResultNumber) => {
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
    TRANSPOSE(value: T | T[] | T[][])
  `,
  // @ts-expect-error we are not really setup to use matrices yet
  (value: EvaluationResult | EvaluationResult[] | EvaluationResult[][]) => {
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
