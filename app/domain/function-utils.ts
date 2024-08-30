import {
  type EvaluationResult,
  EvaluationResultKind,
  EvaluationResultKinds,
} from '~/domain/evaluation-result'
import { printEvaluationResult } from './evaluation'

export function expose<T extends EvaluationResult>(
  name: string,
  options: {
    args: {
      kind: EvaluationResultKind | EvaluationResultKind[]
      name?: string
      description: string
      many?: boolean
      optional?: boolean
    }[]
    description: string
    handle: (...args: EvaluationResult[]) => T
  },
): (...args: EvaluationResult[]) => EvaluationResult {
  let requiredArgs = options.args.filter((arg) => !(arg.optional ?? false))
  let argString = options.args
    .map((arg, i) => {
      let variableName =
        arg.name ??
        `${Array.isArray(arg.kind) ? 'value' : arg.kind.toLowerCase()}${arg.many ? '' : i + 1}`

      let variableType = Array.isArray(arg.kind)
        ? arg.kind === EvaluationResultKinds
          ? 'ANY'
          : `(${arg.kind.join(' | ')})`
        : arg.kind

      return `${arg.many ? '...' : ''}${arg.name ?? `${variableName}`}${arg.optional ? '?' : ''}: ${variableType}${arg.many ? '[]' : ''}`
    })
    .join(', ')

  return (...args: EvaluationResult[]): EvaluationResult => {
    // Validation

    // Got arguments but function does not take any
    if (options.args.length === 0 && args.length > 0) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: `${name}() does not take any arguments`,
      }
    }

    // More arguments than expected
    if (
      options.args.length < args.length &&
      options.args[options.args.length - 1]?.many !== true
    ) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: `${name}(${argString}) takes at most ${options.args.length} arguments, got ${args.length}`,
      }
    }

    // Not enough arguments
    if (args.length < requiredArgs.length) {
      return {
        kind: EvaluationResultKind.ERROR,
        value:
          requiredArgs.length === 1
            ? `${name}(${argString}) requires an argument`
            : requiredArgs.length === options.args.length
              ? `${name}(${argString}) requires ${requiredArgs.length} arguments, got ${args.length}`
              : `${name}(${argString}) requires at least ${requiredArgs.length} arguments, got ${args.length}`,
      }
    }

    // Validate the types of the arguments
    for (let [idx, arg] of options.args.entries()) {
      if (
        !(Array.isArray(arg.kind)
          ? args[idx]?.kind
            ? arg.kind.includes(args[idx].kind)
            : false
          : args[idx]?.kind === arg.kind)
      ) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: `${name}(${argString}) expects a \`${arg.kind}\`, got \`${args[idx] ? `${args[idx].kind}(${printEvaluationResult(args[idx])})` : '<nothing>'}\``,
        }
      }
    }

    // Handle
    return options.handle(...args)
  }
}
