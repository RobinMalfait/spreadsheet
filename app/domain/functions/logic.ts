import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const TRUE = expose(
  `
    @description The boolean value true

    TRUE()
  `,
  () => {
    return { kind: EvaluationResultKind.BOOLEAN, value: true }
  },
)

export const FALSE = expose(
  `
    @description The boolean value false

    FALSE()
  `,
  () => {
    return { kind: EvaluationResultKind.BOOLEAN, value: false }
  },
)

// @describe test The condition to evaluate
// @describe consequent The value to return if the condition is true
// @describe alternate The value to return if the condition is false
export const IF = expose(
  `
    @description Returns one value if a condition is true and another value if it is false

    IF(test: BOOLEAN, consequent: T, alternate: T)
  `,
  (test: EvaluationResult, consequent: EvaluationResult, alternate: EvaluationResult) => {
    return test.value ? consequent : alternate
  },
)

// @describe expressions The conditions to evaluate
export const AND = expose(
  `
    @description Returns true if all conditions are true

    AND(...expressions: T)
  `,
  (...args) => {
    return args.every((arg) => arg.value) ? TRUE() : FALSE()
  },
)

// @describe expressions The conditions to evaluate
export const OR = expose(
  `
    @description Returns true if any condition is true

    OR(...expressions: T)
  `,
  (...args) => {
    return args.some((arg) => arg.value) ? TRUE() : FALSE()
  },
)

// @describe value The condition to negate
export const NOT = expose(
  `
    @description Returns true if the condition is false

    NOT(value: BOOLEAN)
  `,
  (lhs: EvaluationResult) => {
    return lhs.value ? FALSE() : TRUE()
  },
)
