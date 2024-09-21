import {
  type EvaluationResult,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'
import { flatten } from '~/utils/flatten'

export const TRUE = expose(
  `
    @description The boolean value true.
    @example TRUE()
    TRUE()
  `,
  () => {
    return { kind: EvaluationResultKind.BOOLEAN, value: true }
  },
)

export const FALSE = expose(
  `
    @description The boolean value false.
    @example FALSE()
    FALSE()
  `,
  () => {
    return { kind: EvaluationResultKind.BOOLEAN, value: false }
  },
)

export const SWITCH = expose(
  `
    @description Returns the matching value for the first condition that is true.
    @param value The value to test against the conditions.
    @param cases The cases and the values to return.
    @example SWITCH(1, 1, "st", 2, "nd", 3, "rd", "th")
    @example SWITCH(2, 1, "st", 2, "nd", 3, "rd", "th")
    @example SWITCH(3, 1, "st", 2, "nd", 3, "rd", "th")
    @example SWITCH(4, 1, "st", 2, "nd", 3, "rd", "th")
    @example SWITCH(5, 1, "st", 2, "nd", 3, "rd", "th")
    SWITCH(value: T, ...cases: T, default?: T)
  `,
  (value: EvaluationResult, ...cases: EvaluationResult[]) => {
    let defaultValue = cases.length & 1 ? cases.pop() : null

    // Try to find a matching case
    for (let i = 0; i < cases.length; i += 2) {
      let condition = cases[i]
      let result = cases[i + 1]

      if (!condition) {
        return { kind: EvaluationResultKind.ERROR, value: 'SWITCH() Missing case' }
      }

      if (!result) {
        return { kind: EvaluationResultKind.ERROR, value: 'SWITCH() Missing value' }
      }

      if (condition.value === value.value) {
        return result
      }
    }

    // No matching cases, try the default
    if (defaultValue) return defaultValue

    // Still nothing, let's error
    return {
      kind: EvaluationResultKind.ERROR,
      value: `SWITCH(${value.value}) No matching case found`,
    }
  },
)

export const IF = expose(
  `
    @description Returns one value if a condition is true and another value if it is false.
    @param test The condition to evaluate.
    @param consequent The value to return if the condition is true.
    @param alternate The value to return if the condition is false.
    @example IF(TRUE(), "huge if true", "huge if false")
    @example IF(FALSE(), "huge if true", "huge if false")
    IF(test: BOOLEAN, consequent: T, alternate: T)
  `,
  (test: EvaluationResult, consequent: EvaluationResult, alternate: EvaluationResult) => {
    return test.value ? consequent : alternate
  },
)

export const IF_ERROR = expose(
  `
    @description Returns one value if a condition is an error and another value if it is not.
    @param value The value to test against an error.
    @param fallback The value to return if the condition is an error.
    @example IF_ERROR(123 / 1, 0)
    @example IF_ERROR(123 / 0, 0)
    IF_ERROR(value: T, fallback: T)
  `,
  (value: EvaluationResult, fallback: EvaluationResult) => {
    if (value.kind === EvaluationResultKind.ERROR) {
      return fallback
    }

    return value
  },
)

export const AND = expose(
  `
    @description Returns true if all conditions are true.
    @param expressions The conditions to evaluate.
    @example AND(TRUE(), TRUE(), TRUE())
    @example AND(TRUE(), TRUE(), FALSE())
    AND(...expressions: T)
  `,
  (...args) => {
    for (let arg of flatten(args)) {
      if (!arg.value) {
        return FALSE()
      }
    }
    return TRUE()
  },
)

export const OR = expose(
  `
    @description Returns true if any condition is true.
    @param expressions The conditions to evaluate.
    @example OR(TRUE(), TRUE(), TRUE())
    @example OR(TRUE(), TRUE(), FALSE())
    OR(...expressions: T)
  `,
  (...args) => {
    for (let arg of flatten(args)) {
      if (arg.value) {
        return TRUE()
      }
    }
    return FALSE()
  },
)

export const NOT = expose(
  `
    @description Returns true if the condition is false.
    @param value The condition to negate.
    @example NOT(TRUE())
    @example NOT(FALSE())
    NOT(value: BOOLEAN)
  `,
  (lhs: EvaluationResult) => {
    return lhs.value ? FALSE() : TRUE()
  },
)

export const BIT_AND = expose(
  `
    @description Returns the bitwise AND of two numbers.
    @param lhs The left hand side of the operation.
    @param rhs The right hand side of the operation.
    @example BIT_AND(5, 3)
    BIT_AND(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: lhs.value & rhs.value,
    }
  },
)

export const BIT_OR = expose(
  `
    @description Returns the bitwise OR of two numbers.
    @param lhs The left hand side of the operation.
    @param rhs The right hand side of the operation.
    @example BIT_OR(5, 3)
    BIT_OR(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: lhs.value | rhs.value,
    }
  },
)

export const BIT_XOR = expose(
  `
    @description Returns the bitwise XOR of two numbers.
    @param lhs The left hand side of the operation.
    @param rhs The right hand side of the operation.
    @example BIT_XOR(5, 3)
    BIT_XOR(lhs: NUMBER, rhs: NUMBER)
  `,
  (lhs: EvaluationResultNumber, rhs: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: lhs.value ^ rhs.value,
    }
  },
)

export const BIT_LSHIFT = expose(
  `
    @description Returns the bitwise left shift of a number.
    @param value The number to shift.
    @param amount The number of bits to shift.
    @example BIT_LSHIFT(5, 3)
    BIT_LSHIFT(value: NUMBER, amount: NUMBER)
  `,
  (value: EvaluationResultNumber, amount: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: value.value << amount.value,
    }
  },
)

export const BIT_RSHIFT = expose(
  `
    @description Returns the bitwise left shift of a number.
    @param value The number to shift.
    @param amount The number of bits to shift.
    @example BIT_RSHIFT(5, 3)
    BIT_RSHIFT(value: NUMBER, amount: NUMBER)
  `,
  (value: EvaluationResultNumber, amount: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: value.value >> amount.value,
    }
  },
)
