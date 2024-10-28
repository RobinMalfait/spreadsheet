import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'
import { type Signature, printSignature } from '~/domain/signature/parser'
import { flatten } from '~/utils/flatten'

export function validate(
  signature: Signature,
  args: (
    | EvaluationResult // Unit
    | EvaluationResult[] // 1D
    | EvaluationResult[][] // 2D
  )[],
): EvaluationResult | null {
  // Got arguments but function does not take any
  if (signature.args.length === 0 && args.length > 0) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `${printSignature(signature)} does not take any arguments`,
    }
  }

  // Provided more arguments than expected
  if (
    signature.args.length < args.length &&
    signature.args.every((arg) => !arg.variadic)
  ) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: `${printSignature(signature)} takes at most ${signature.args.length} ${signature.args.length === 1 ? 'argument' : 'arguments'}, got ${args.length}`,
    }
  }

  let offset = 0
  for (let arg of signature.args) {
    do {
      let incomingArg = args[offset++]

      // Argument was not provided
      if (!incomingArg) {
        // But it was optional, so we can skip it
        if (arg.optional) continue

        // But it was required, so we error
        return {
          kind: EvaluationResultKind.ERROR,
          value: `${printSignature(signature)} Argument \`${arg.name}\` was not provided`,
        }
      }

      // Validate items in the array
      if (Array.isArray(incomingArg)) {
        for (let _incomingArg of flatten(incomingArg)) {
          // Validate the type of the argument
          if (!arg.types.includes(_incomingArg.kind) && !arg.types.includes('T')) {
            return {
              kind: EvaluationResultKind.ERROR,
              value: arg.variadic
                ? `${printSignature(signature)} Argument \`${arg.name}[]\` received a \`${_incomingArg.kind}\` as the ${formatOrdinals(offset + 1)} argument`
                : `${printSignature(signature)} Argument \`${arg.name}[]\` received a \`${_incomingArg.kind}\``,
            }
          }
        }
      }

      // Validate the type of the argument
      else if (!arg.types.includes(incomingArg.kind) && !arg.types.includes('T')) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: arg.variadic
            ? `${printSignature(signature)} Argument \`${arg.name}\` received a \`${incomingArg.kind}\` as the ${formatOrdinals(offset + 1)} argument`
            : `${printSignature(signature)} Argument \`${arg.name}\` received a \`${incomingArg.kind}\``,
        }
      }
    } while (arg.variadic && offset < args.length)
  }

  return null
}

const pr = new Intl.PluralRules('en-US', { type: 'ordinal' })
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
])

function formatOrdinals(n: number) {
  let rule = pr.select(n)
  let suffix = suffixes.get(rule)
  return `${n}${suffix}`
}
