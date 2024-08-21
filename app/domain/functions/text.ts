import {
  type EvaluationResult,
  EvaluationResultKind,
  printEvaluationResult,
} from '~/domain/evaluation'

export function CONCAT(...args: EvaluationResult[]): EvaluationResult {
  let out = ''

  for (let arg of args) {
    out += printEvaluationResult(arg)
  }

  return { kind: EvaluationResultKind.STRING, value: out }
}

export function JOIN(
  delimiter?: EvaluationResult,
  ...args: EvaluationResult[]
): EvaluationResult {
  if (delimiter?.kind !== EvaluationResultKind.STRING) {
    throw new Error(
      `JOIN() expects a string as the delimiter, got ${delimiter?.value ?? '<nothing>'}`,
    )
  }

  let out: string[] = []

  for (let arg of args) {
    out.push(printEvaluationResult(arg))
  }

  return { kind: EvaluationResultKind.STRING, value: out.join(delimiter.value) }
}

export function LOWER(
  arg?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error(`LOWER() does not take more than one argument, got ${extra.value}`)
  }

  if (!arg) {
    throw new Error('LOWER() expects a value as the first argument, got <nothing>')
  }

  return {
    kind: EvaluationResultKind.STRING,
    value: printEvaluationResult(arg).toLowerCase(),
  }
}

export function UPPER(
  arg?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error(`UPPER() does not take more than one argument, got ${extra.value}`)
  }

  if (!arg) {
    throw new Error('UPPER() expects a value as the first argument, got <nothing>')
  }

  return {
    kind: EvaluationResultKind.STRING,
    value: printEvaluationResult(arg).toUpperCase(),
  }
}

export function LEN(arg?: EvaluationResult, extra?: EvaluationResult): EvaluationResult {
  if (extra) {
    throw new Error(`LEN() does not take more than one argument, got ${extra.value}`)
  }

  if (!arg) {
    throw new Error('LEN() expects a value as the first argument, got <nothing>')
  }

  if (arg.kind !== EvaluationResultKind.STRING) {
    throw new Error(`LEN() expects a string as the first argument, got ${arg.value}`)
  }

  return { kind: EvaluationResultKind.NUMBER, value: arg.value.length }
}

export function TRIM(arg?: EvaluationResult, extra?: EvaluationResult): EvaluationResult {
  if (extra) {
    throw new Error(`TRIM() does not take more than one argument, got ${extra.value}`)
  }

  if (!arg) {
    throw new Error('TRIM() expects a value as the first argument, got <nothing>')
  }

  if (arg.kind !== EvaluationResultKind.STRING) {
    throw new Error(`TRIM() expects a string as the first argument, got ${arg.value}`)
  }

  return { kind: EvaluationResultKind.STRING, value: arg.value.trim() }
}

export function FIND_FIRST(
  haystack: EvaluationResult,
  ...needles: EvaluationResult[]
): EvaluationResult {
  if (needles.length === 0) {
    throw new Error('FIND_FIRST() expects at least one needle')
  }

  if (haystack.kind !== EvaluationResultKind.STRING) {
    throw new Error(
      `FIND_FIRST() expects a string as the first argument, got ${haystack.value}`,
    )
  }

  let index = -1
  let value = ''

  for (let needle of needles) {
    if (
      needle.kind !== EvaluationResultKind.STRING &&
      needle.kind !== EvaluationResultKind.NUMBER
    ) {
      throw new Error(`FIND_FIRST() expects a string as the needle, got ${needle.value}`)
    }

    let idx = haystack.value.indexOf(needle.value.toString())

    if (idx !== -1 && (index === -1 || idx < index)) {
      index = idx
      value = needle.value.toString()
    }
  }

  return { kind: EvaluationResultKind.STRING, value: value }
}

export function FIND_LAST(
  haystack: EvaluationResult,
  ...needles: EvaluationResult[]
): EvaluationResult {
  if (needles.length === 0) {
    throw new Error('FIND_LAST() expects at least one needle')
  }

  if (haystack.kind !== EvaluationResultKind.STRING) {
    throw new Error(
      `FIND_LAST() expects a string as the first argument, got ${haystack.value}`,
    )
  }

  let index = -1
  let value = ''

  for (let needle of needles) {
    if (
      needle.kind !== EvaluationResultKind.STRING &&
      needle.kind !== EvaluationResultKind.NUMBER
    ) {
      throw new Error(`FIND_LAST() expects a string as the needle, got ${needle.value}`)
    }

    let idx = haystack.value.lastIndexOf(needle.value.toString())

    if (idx !== -1 && (index === -1 || idx > index)) {
      index = idx
      value = needle.value.toString()
    }
  }

  return { kind: EvaluationResultKind.STRING, value: value }
}

export function REPLACE_ALL(
  haystack?: EvaluationResult,
  ...zip: EvaluationResult[]
): EvaluationResult {
  if (haystack?.kind !== EvaluationResultKind.STRING) {
    throw new Error(
      `REPLACE_ALL() expects a string as the first three arguments, got ${haystack?.value ?? '<nothing>'}`,
    )
  }

  let values: string[] = []
  let replacements: string[] = []
  for (let idx = 0; idx < zip.length; idx += 2) {
    let value = zip[idx]
    if (value === undefined) {
      throw new Error('REPLACE_ALL() expects an even number of arguments')
    }

    let replacement = zip[idx + 1]
    if (replacement === undefined) {
      throw new Error('REPLACE_ALL() expects an even number of arguments')
    }

    if (
      value.kind !== EvaluationResultKind.STRING &&
      value.kind !== EvaluationResultKind.NUMBER
    ) {
      throw new Error(`REPLACE_ALL() expects a string as the needle, got ${value.value}`)
    }

    if (
      replacement.kind !== EvaluationResultKind.STRING &&
      replacement.kind !== EvaluationResultKind.NUMBER
    ) {
      throw new Error(
        `REPLACE_ALL() expects a string as the needle, got ${replacement.value}`,
      )
    }

    values.push(value.value.toString())
    replacements.push(replacement.value.toString())
  }

  let value = haystack.value
  for (let idx = 0; idx < value.length; idx++) {
    let iidx = values.findIndex((word) => value.slice(idx).startsWith(word))
    if (iidx !== -1) {
      let needle = values[iidx]
      if (needle === undefined) {
        throw new Error('REPLACE_ALL() expects an even number of arguments')
      }
      let replacement = replacements[iidx]
      if (replacement === undefined) {
        throw new Error('REPLACE_ALL() expects an even number of arguments')
      }

      value = value.replace(needle, replacement)
      idx += replacement.length - needle.length
    }
  }

  return {
    kind: EvaluationResultKind.STRING,
    value,
  }
}
