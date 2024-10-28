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
    (
      // Due to the spread, there is an additional set of brackets around the
      // types for the arguments.
      ...args: (
        | EvaluationResult // Unit
        | EvaluationResult[] // 1D
        | EvaluationResult[][] // 2D
      )[]
    ) => {
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

export function withSignature(
  signature: string,
  handle: (
    ctx: Context,
    // Due to the spread, there is an additional set of brackets around the
    // types for the arguments.
    ...args: (
      | EvaluationResult // Unit
      | EvaluationResult[] // 1D
      | EvaluationResult[][] // 2D
    )[]
  ) => EvaluationResult | EvaluationResult[] | EvaluationResult[][],
) {
  let sig = parse(tokenize(signature))

  return Object.assign(handle, { signature: sig })
}
