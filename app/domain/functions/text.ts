import { type EvaluationResult, EvaluationResultKind } from '../spreadsheet'

export function CONCAT(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    if (arg.kind === EvaluationResultKind.NUMBER) {
      out += arg.value.toString()
    } else if (arg.kind === EvaluationResultKind.STRING) {
      out += arg.value
    }
  }

  return { kind: EvaluationResultKind.STRING, value: out }
}

export function LOWER(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    if (arg.kind === EvaluationResultKind.STRING) {
      out += arg.value.toLowerCase()
    }
  }

  return { kind: EvaluationResultKind.STRING, value: out }
}

export function UPPER(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    if (arg.kind === EvaluationResultKind.STRING) {
      out += arg.value.toUpperCase()
    }
  }

  return { kind: EvaluationResultKind.STRING, value: out }
}
