import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const TRUE = expose('TRUE()', {
  description: 'The boolean value true',
  handle() {
    return { kind: EvaluationResultKind.BOOLEAN, value: true }
  },
})

export const FALSE = expose('FALSE()', {
  description: 'The boolean value false',
  handle() {
    return { kind: EvaluationResultKind.BOOLEAN, value: false }
  },
})

export const IF = expose(
  // @describe test The condition to evaluate
  // @describe consequent The value to return if the condition is true
  // @describe alternate The value to return if the condition is false
  'IF(test: BOOLEAN, consequent: T, alternate: T)',
  {
    description:
      'Returns one value if a condition is true and another value if it is false',
    handle(
      test: EvaluationResult,
      consequent: EvaluationResult,
      alternate: EvaluationResult,
    ) {
      return test.value ? consequent : alternate
    },
  },
)

export const AND = expose(
  // @describe expressions The conditions to evaluate
  'AND(...expressions: T)',
  {
    description: 'Returns true if all conditions are true',
    handle(...args) {
      return args.every((arg) => arg.value) ? TRUE() : FALSE()
    },
  },
)

export const OR = expose(
  // @describe expressions The conditions to evaluate
  'OR(...expressions: T)',
  {
    description: 'Returns true if any condition is true',
    handle(...args) {
      return args.some((arg) => arg.value) ? TRUE() : FALSE()
    },
  },
)

export const NOT = expose(
  // @describe value The condition to negate
  'NOT(value: BOOLEAN)',
  {
    description: 'Returns true if the condition is false',
    handle(lhs: EvaluationResult) {
      return lhs.value ? FALSE() : TRUE()
    },
  },
)
