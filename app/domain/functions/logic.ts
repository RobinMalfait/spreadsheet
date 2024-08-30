import {
  type EvaluationResult,
  EvaluationResultKind,
  EvaluationResultKinds,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const TRUE = expose('TRUE', {
  args: [],
  description: 'The boolean value true',
  handle: () => ({
    kind: EvaluationResultKind.BOOLEAN,
    value: true,
  }),
})

export const FALSE = expose('FALSE', {
  args: [],
  description: 'The boolean value false',
  handle: () => ({
    kind: EvaluationResultKind.BOOLEAN,
    value: false,
  }),
})

export const IF = expose('IF', {
  args: [
    {
      kind: EvaluationResultKind.BOOLEAN,
      name: 'test',
      description: 'The condition to evaluate',
    },
    {
      kind: EvaluationResultKinds,
      name: 'consequent',
      description: 'The value to return if the condition is true',
    },
    {
      kind: EvaluationResultKinds,
      name: 'alternate',
      description: 'The value to return if the condition is false',
    },
  ],
  description:
    'Returns one value if a condition is true and another value if it is false',
  handle: (
    test: EvaluationResult,
    consequent: EvaluationResult,
    alternate: EvaluationResult,
  ) => (test.value ? consequent : alternate),
})

export const AND = expose('AND', {
  args: [
    {
      kind: EvaluationResultKinds,
      description: 'The first condition to evaluate',
    },
    {
      many: true,
      kind: EvaluationResultKinds,
      description: 'Additional conditions to evaluate',
    },
  ],
  description: 'Returns true if all conditions are true',
  handle: (...args: EvaluationResult[]) => {
    return args.every((arg) => arg.value) ? TRUE() : FALSE()
  },
})

export const OR = expose('OR', {
  args: [
    {
      kind: EvaluationResultKinds,
      description: 'The first condition to evaluate',
    },
    {
      many: true,
      kind: EvaluationResultKinds,
      description: 'Additional conditions to evaluate',
    },
  ],
  description: 'Returns true if any condition is true',
  handle: (...args: EvaluationResult[]) => {
    return args.some((arg) => arg.value) ? TRUE() : FALSE()
  },
})

export const NOT = expose('NOT', {
  args: [
    {
      kind: EvaluationResultKind.BOOLEAN,
      description: 'The condition to negate',
    },
  ],
  description: 'Returns true if the condition is false',
  handle: (lhs: EvaluationResult) => (lhs.value ? FALSE() : TRUE()),
})
