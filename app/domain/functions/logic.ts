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
  return test.value ? consequent : alternate
}

export function AND(...args: EvaluationResult[]): EvaluationResult {
  return args.every((arg) => arg.value) ? TRUE() : FALSE()
}

export function OR(...args: EvaluationResult[]): EvaluationResult {
  return args.some((arg) => arg.value) ? TRUE() : FALSE()
}
