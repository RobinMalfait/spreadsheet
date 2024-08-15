import { type EvaluationResult, EvaluationResultKind } from '../spreadsheet'

export function TRUE(): EvaluationResult {
  return { kind: EvaluationResultKind.BOOLEAN, value: true, string: 'TRUE' }
}

export function FALSE(): EvaluationResult {
  return { kind: EvaluationResultKind.BOOLEAN, value: false, string: 'FALSE' }
}

export function IF(
  test: EvaluationResult,
  consequent: EvaluationResult,
  alternate: EvaluationResult,
): EvaluationResult {
  return test.value !== 0 ? consequent : alternate
}
