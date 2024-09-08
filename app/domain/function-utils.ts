import type { Context } from '~/domain/evaluation'
import type { EvaluationResult } from '~/domain/evaluation-result'
import { parse } from '~/domain/signature/parser'
import { tokenize } from '~/domain/signature/tokenizer'
import { validate } from '~/domain/signature/validate'

export function expose<
  T extends EvaluationResult[],
  R extends EvaluationResult | EvaluationResult[] | EvaluationResult[][],
>(signature: string, handle: (...args: T) => R) {
  let sig = parse(tokenize(signature))

  return Object.assign(
    (...args: EvaluationResult[]) => {
      // Validate
      let errors = validate(sig, args)
      if (errors) return errors

      // Handle
      // @ts-expect-error The `validate` function ensures that the correct EvaluationResult is being used.
      return handle(...args) satisfies R
    },
    { signature: sig },
  )
}

export function withSignature<
  T extends EvaluationResult[],
  R extends EvaluationResult | EvaluationResult[] | EvaluationResult[][],
>(signature: string, handle: (ctx: Context, ...args: T) => R) {
  let sig = parse(tokenize(signature))

  return Object.assign(handle, { signature: sig })
}
