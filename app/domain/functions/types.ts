import { printEvaluationResult } from '~/domain/evaluation'
import { EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const TYPE = expose('TYPE(value: T)', {
  description: 'Returns the type of a value',
  handle(value) {
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
  },
})

export const AS_NUMBER = expose('AS_NUMBER(value: T)', {
  description: 'Converts a value to a number',
  handle(value) {
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
  },
})

export const AS_STRING = expose('AS_STRING(value: T)', {
  description: 'Converts a value to a string',
  handle(value) {
    if (value.kind === EvaluationResultKind.STRING) {
      return value
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: printEvaluationResult(value),
    }
  },
})

export const AS_BOOLEAN = expose('AS_BOOLEAN(value: T)', {
  description: 'Converts a value to a boolean',
  handle(value) {
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
  },
})
