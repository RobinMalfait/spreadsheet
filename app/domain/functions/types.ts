import { printEvaluationResult } from '~/domain/evaluation'
import { EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const TYPE = expose(
  `
    @description Returns the type of a value.
    @param value The value to check.
    @example TYPE(1)
    @example TYPE("hello")
    @example TYPE(TRUE())
    @example TYPE(NOW())
    @example TYPE(UNKNOWN_FUNCTION())
    @example TYPE(B1)
    TYPE(value: T)
  `,
  (value) => {
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
)

export const AS_NUMBER = expose(
  `
    @description Tries to convert a value to a number.
    @param value The value to convert.
    @example AS_NUMBER(1)
    @example AS_NUMBER("123")
    @example AS_NUMBER("million")
    @example AS_NUMBER(TRUE())
    @example AS_NUMBER(FALSE())
    @example AS_NUMBER(NOW())
    AS_NUMBER(value: T)
  `,
  (value) => {
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
)

export const AS_NUMBERS = expose(
  `
    @description Tries to convert a list of values to numbers.
    @param values The values to convert.
    @example AS_NUMBERS(1, "123", "million", TRUE(), FALSE(), NOW())
    AS_NUMBERS(...values: T)
  `,
  (...values) => {
    return values.map((value) => AS_NUMBER(value))
  },
)

export const AS_STRING = expose(
  `
    @description Tries to convert a value to a string.
    @param value The value to convert.
    @example AS_STRING(1)
    @example AS_STRING("123")
    @example AS_STRING(TRUE())
    @example AS_STRING(FALSE())
    @example AS_STRING(NOW())
    @example AS_STRING(TIME())
    AS_STRING(value: T)
  `,
  (value) => {
    if (value.kind === EvaluationResultKind.STRING) {
      return value
    }

    return {
      kind: EvaluationResultKind.STRING,
      value: printEvaluationResult(value),
    }
  },
)

export const AS_STRINGS = expose(
  `
    @description Tries to convert a list of values to strings.
    @param values The values to convert.
    @example AS_STRINGS(1, "123", TRUE(), FALSE(), NOW(), TIME())
    AS_STRINGS(...values: T)
  `,
  (...values) => {
    return values.map((value) => AS_STRING(value))
  },
)

export const AS_BOOLEAN = expose(
  `
    @description Tries to convert a value to a boolean.
    @param value The value to convert.
    @example AS_BOOLEAN(0)
    @example AS_BOOLEAN(1)
    @example AS_BOOLEAN("123")
    @example AS_BOOLEAN("0")
    @example AS_BOOLEAN(TRUE())
    @example AS_BOOLEAN(FALSE())
    @example AS_BOOLEAN(NOW())
    AS_BOOLEAN(value: T)
  `,
  (value) => {
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
)

export const AS_BOOLEANS = expose(
  `
    @description Tries to convert a list of values to booleans.
    @param values The values to convert.
    @example AS_BOOLEANS(0, 1, "123", "0", TRUE(), FALSE(), NOW())
    AS_BOOLEANS(...values: T)
  `,
  (...values) => {
    return values.map((value) => AS_BOOLEAN(value))
  },
)
