import { EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'
import { flatten } from '~/utils/flatten'

export const COUNT = expose(
  `
    @description Count the number of NUMBER arguments.
    @param values The values to count.
    @example COUNT(1, 2, TRUE(), "hello world", 3.2)
    COUNT(...values: T)
  `,
  (...args) => {
    let count = 0

    for (let arg of flatten(args)) {
      switch (arg.kind) {
        case EvaluationResultKind.NUMBER:
          count += 1
          break
        case EvaluationResultKind.ERROR:
        case EvaluationResultKind.EMPTY:
        case EvaluationResultKind.BOOLEAN:
        case EvaluationResultKind.STRING:
        case EvaluationResultKind.DATETIME:
          // Explicitly ignored
          break
        default:
          arg satisfies never
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: count }
  },
)

export const MIN = expose(
  `
    @description Returns the smallest NUMBER argument.
    @param values The values to compare.
    @example MIN(5, 4, 1, 2, 3)
    MIN(...values: T)
  `,
  (...args) => {
    let min = Number.POSITIVE_INFINITY

    for (let arg of flatten(args)) {
      switch (arg.kind) {
        case EvaluationResultKind.ERROR:
          return arg
        case EvaluationResultKind.NUMBER:
          min = Math.min(min, arg.value)
          break
        case EvaluationResultKind.EMPTY:
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
  },
)

export const MAX = expose(
  `
    @description Returns the largest NUMBER argument.
    @param values The values to compare.
    @example MAX(1, 3, 2, 5, 4)
    MAX(...values: T)
  `,
  (...args) => {
    let max = Number.NEGATIVE_INFINITY

    for (let arg of flatten(args)) {
      switch (arg.kind) {
        case EvaluationResultKind.ERROR:
          return arg
        case EvaluationResultKind.NUMBER:
          max = Math.max(max, arg.value)
          break
        case EvaluationResultKind.EMPTY:
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
  },
)

export const AVERAGE = expose(
  `
    @description Returns the average of NUMBER arguments.
    @param values The values to compare.
    @example AVERAGE(1, 3, 2, 5, 4)
    AVERAGE(...values: T)
  `,
  (...args) => {
    let sum = 0
    let count = 0

    for (let arg of flatten(args)) {
      switch (arg.kind) {
        case EvaluationResultKind.ERROR:
          return arg
        case EvaluationResultKind.NUMBER:
          count += 1
          sum += arg.value
          break
        case EvaluationResultKind.EMPTY:
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
  },
)

export const MEDIAN = expose(
  `
    @description Returns the median of NUMBER arguments.
    @param values The values to compare.
    @example MEDIAN(1, 3, 2, 5, 4)
    MEDIAN(...values: T)
  `,
  (...args) => {
    let values = Array.from(flatten(args))
      .filter((arg) => arg.kind === EvaluationResultKind.NUMBER)
      .map((arg) => arg.value)
      .sort((a, z) => a - z)

    let n = values.length
    let mid = Math.floor(n / 2)

    if ((n & 1) === 0) {
      return {
        kind: EvaluationResultKind.NUMBER,
        value: ((values[mid - 1] ?? 0) + (values[mid] ?? 0)) / 2,
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: values[mid] ?? 0 }
  },
)

export const MODE = expose(
  `
    @description Returns the mode of NUMBER arguments.
    @param values The values to compare.
    @example MODE(3, 2, 1, 3, 3, 4, 5, 8, 9, 1)
    MODE(...values: T)
  `,
  (...args) => {
    let maxCount = 0
    let mode = Number.NaN
    let counts = new Map<number, number>()

    for (let arg of flatten(args)) {
      if (arg.kind === EvaluationResultKind.ERROR) {
        return arg
      }

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
  },
)
