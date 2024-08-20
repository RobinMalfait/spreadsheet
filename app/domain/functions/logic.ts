import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation'

export function TRUE(extra?: EvaluationResult): EvaluationResult {
  if (extra) {
    throw new Error(`TRUE() does not take an argument, got ${extra.value}`)
  }

  return { kind: EvaluationResultKind.BOOLEAN, value: true }
}

export function FALSE(extra?: EvaluationResult): EvaluationResult {
  if (extra) {
    throw new Error(`FALSE() does not take an argument, got ${extra.value}`)
  }

  return { kind: EvaluationResultKind.BOOLEAN, value: false }
}

export function IF(
  test: EvaluationResult,
  consequent: EvaluationResult,
  alternate: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error(`IF() does not take more than three arguments, got ${extra.value}`)
  }

  if (test.kind === EvaluationResultKind.STRING) {
    throw new Error(`IF() expects a boolean as the first argument, got ${test.value}`)
  }

  return test.value ? consequent : alternate
}

export function AND(...args: EvaluationResult[]): EvaluationResult {
  return args.every((arg) => arg.value) ? TRUE() : FALSE()
}

export function OR(...args: EvaluationResult[]): EvaluationResult {
  return args.some((arg) => arg.value) ? TRUE() : FALSE()
}

export function NOT(lhs: EvaluationResult, extra?: EvaluationResult): EvaluationResult {
  if (extra) {
    throw new Error(`NOT() does not take a second argument, got ${extra.value}`)
  }

  if (lhs.kind === EvaluationResultKind.STRING) {
    throw new Error(`NOT() expects a boolean as the first argument, got ${lhs.value}`)
  }

  return lhs.value ? FALSE() : TRUE()
}
