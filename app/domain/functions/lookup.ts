import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'
import { flatten } from '~/utils/flatten'

export const LOOKUP = expose(
  `
    @description Lookup a value in a range, and return the value in the same position from another range.
    @example LOOKUP(2, RANGE(1, 3), RANGE(4, 6))
    LOOKUP(value: T, lhs: T, rhs: T, fallback?: T)
  `,
  (
    value: EvaluationResult,
    lhs: EvaluationResult[],
    rhs: EvaluationResult[],
    fallback: EvaluationResult,
  ) => {
    let idx = Array.from(flatten(lhs)).findIndex((cell) => {
      return cell.kind === value.kind && cell.value === value.value
    })
    if (idx !== -1) return Array.from(flatten(rhs))[idx]

    return (
      fallback ?? {
        kind: EvaluationResultKind.ERROR,
        value: 'Did not find value in LOOKUP(…)',
      }
    )
  },
)
