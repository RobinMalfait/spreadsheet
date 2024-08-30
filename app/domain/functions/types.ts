import { printEvaluationResult } from '~/domain/evaluation'
import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'

export function TYPE(
  value?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (value === undefined) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'TYPE() expects a value as the first argument, got <nothing>',
    }
  }

  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `TYPE() does not take more than one argument, got ${extra.value}`,
    }
  }

  switch (value.kind) {
    case EvaluationResultKind.ERROR:
      return { kind: EvaluationResultKind.STRING, value: 'error' }
    case EvaluationResultKind.EMPTY:
      return { kind: EvaluationResultKind.STRING, value: 'empty' }
    case EvaluationResultKind.NUMBER:
      return { kind: EvaluationResultKind.STRING, value: 'number' }
    case EvaluationResultKind.STRING:
      return { kind: EvaluationResultKind.STRING, value: 'string' }
    case EvaluationResultKind.BOOLEAN:
      return { kind: EvaluationResultKind.STRING, value: 'boolean' }
    case EvaluationResultKind.DATETIME:
      return { kind: EvaluationResultKind.STRING, value: 'datetime' }
    default:
      value satisfies never
      return value
  }
}

export function AS_NUMBER(
  value?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (value === undefined) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'AS_NUMBER() expects a value as the first argument, got <nothing>',
    }
  }

  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `AS_NUMBER() does not take more than one argument, got ${extra.value}`,
    }
  }

  switch (value.kind) {
    // No need to convert an error to a number
    case EvaluationResultKind.ERROR:
    // No need to convert a number to a number
    case EvaluationResultKind.NUMBER:
    // We can't convert an empty value to a number. We could return 0, which
    // helps in places like `SUM(…)`. But if you use `PRODUCT(…)`, we want 1
    // instead. Not enough context to make a decision here.
    case EvaluationResultKind.EMPTY:
      return value

    case EvaluationResultKind.BOOLEAN:
      return { kind: EvaluationResultKind.NUMBER, value: value.value ? 1 : 0 }

    case EvaluationResultKind.DATETIME:
      return { kind: EvaluationResultKind.NUMBER, value: value.value.getTime() }

    case EvaluationResultKind.STRING: {
      let asNumber = Number(value.value)
      if (Number.isNaN(asNumber)) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: `AS_NUMBER() expects a number, got ${value.value}`,
        }
      }

      return { kind: EvaluationResultKind.NUMBER, value: asNumber }
    }

    default:
      value satisfies never
      return value
  }
}

export function AS_STRING(
  value?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (value === undefined) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'AS_STRING() expects a value as the first argument, got <nothing>',
    }
  }

  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `AS_STRING() does not take more than one argument, got ${extra.value}`,
    }
  }

  if (value.kind === EvaluationResultKind.STRING) {
    return value
  }

  return {
    kind: EvaluationResultKind.STRING,
    value: printEvaluationResult(value),
  }
}

export function AS_BOOLEAN(
  value?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (value === undefined) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'AS_BOOLEAN() expects a value as the first argument, got <nothing>',
    }
  }

  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `AS_BOOLEAN() does not take more than one argument, got ${extra.value}`,
    }
  }

  if (value.kind === EvaluationResultKind.BOOLEAN) {
    return value
  }

  switch (value.kind) {
    case EvaluationResultKind.ERROR:
      return { kind: EvaluationResultKind.BOOLEAN, value: false }
    case EvaluationResultKind.EMPTY:
      return { kind: EvaluationResultKind.BOOLEAN, value: false }
    case EvaluationResultKind.NUMBER:
      return { kind: EvaluationResultKind.BOOLEAN, value: value.value !== 0 }
    case EvaluationResultKind.STRING:
      return { kind: EvaluationResultKind.BOOLEAN, value: value.value.length > 0 }
    case EvaluationResultKind.DATETIME:
      return { kind: EvaluationResultKind.BOOLEAN, value: true }
    default:
      value satisfies never
      return value
  }
}
