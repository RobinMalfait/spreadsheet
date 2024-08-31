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

export const IF = expose(
  `
    @description Returns one value if a condition is true and another value if it is false
    @param test The condition to evaluate
    @param consequent The value to return if the condition is true
    @param alternate The value to return if the condition is false
    IF(test: BOOLEAN, consequent: T, alternate: T)
  `,
  (test: EvaluationResult, consequent: EvaluationResult, alternate: EvaluationResult) => {
    return test.value ? consequent : alternate
  },
)

export const AND = expose(
  `
    @description Returns true if all conditions are true
    @param expressions The conditions to evaluate
    AND(...expressions: T)
  `,
  (...args) => {
    return args.every((arg) => arg.value) ? TRUE() : FALSE()
  },
)

export const OR = expose(
  `
    @description Returns true if any condition is true
    @param expressions The conditions to evaluate
    OR(...expressions: T)
  `,
  (...args) => {
    return args.some((arg) => arg.value) ? TRUE() : FALSE()
  },
)

export const NOT = expose(
  `
    @description Returns true if the condition is false
    @param value The condition to negate
    NOT(value: BOOLEAN)
  `,
  (lhs: EvaluationResult) => {
    return lhs.value ? FALSE() : TRUE()
  },
)
