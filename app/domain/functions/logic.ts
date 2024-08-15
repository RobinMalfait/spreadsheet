import type { EvaluationResult } from '../spreadsheet'

export function IF(
  test: EvaluationResult,
  consequent: EvaluationResult,
  alternate: EvaluationResult,
): EvaluationResult {
  return test.value !== 0 ? consequent : alternate
}
