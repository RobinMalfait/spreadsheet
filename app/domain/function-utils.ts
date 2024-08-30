import type { EvaluationResult } from '~/domain/evaluation-result'
import { parse } from '~/domain/signature/parser'
import { tokenize } from '~/domain/signature/tokenizer'
import { validate } from '~/domain/signature/validate'

export function expose<
  T extends EvaluationResult,
  R extends EvaluationResult | EvaluationResult[],
>(
  signature: string,
  options: {
    description: string
    handle: (...args: T[]) => R
  },
): (...args: T[]) => R {
  let sig = parse(tokenize(signature))

  return (...args: T[]) => {
    let errors = validate(sig, args)
    if (errors) return errors as R

    // Handle
    return options.handle(...args) as R
  }
}
