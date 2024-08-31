import { printEvaluationResult } from '~/domain/evaluation'
import {
  EvaluationResultKind,
  type EvaluationResultNumber,
  type EvaluationResultString,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const CONCAT = expose(
  `
    @description Concatenates multiple strings together

    CONCAT(...args: T)
  `,
  (...args) => {
    let out = ''

    for (let arg of args) {
      out += printEvaluationResult(arg)
    }

    return { kind: EvaluationResultKind.STRING, value: out }
  },
)

export const JOIN = expose(
  `
    @description Joins multiple strings together with a delimiter

    JOIN(delimiter: STRING, ...args: T)
  `,
  (delimiter: EvaluationResultString, ...args) => {
    let out: string[] = []

    for (let arg of args) {
      out.push(printEvaluationResult(arg))
    }

    return { kind: EvaluationResultKind.STRING, value: out.join(delimiter.value) }
  },
)

export const LOWER = expose(
  `
    @description Converts a string to lowercase

    LOWER(arg: T)
  `,
  (arg) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: printEvaluationResult(arg).toLowerCase(),
    }
  },
)

export const UPPER = expose(
  `
    @description Converts a string to uppercase

    UPPER(arg: T)
  `,
  (arg) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: printEvaluationResult(arg).toUpperCase(),
    }
  },
)

export const LEN = expose(
  `
    @description Returns the length of a string

    LEN(arg: STRING)
  `,
  (arg: EvaluationResultString) => {
    return { kind: EvaluationResultKind.NUMBER, value: arg.value.length }
  },
)

export const TRIM = expose(
  `
    @description Removes leading and trailing whitespace from a string

    TRIM(arg: STRING)
  `,
  (arg: EvaluationResultString) => {
    return { kind: EvaluationResultKind.STRING, value: arg.value.trim() }
  },
)

export const FIND_FIRST = expose(
  `
    @description Returns the first needle found in the haystack

    FIND_FIRST(haystack: STRING, ...needles: STRING)
  `,
  (haystack: EvaluationResultString, ...needles: EvaluationResultString[]) => {
    let index = -1
    let value = ''

    for (let needle of needles) {
      let idx = haystack.value.indexOf(needle.value)

      if (idx !== -1 && (index === -1 || idx < index)) {
        index = idx
        value = needle.value
      }
    }

    return { kind: EvaluationResultKind.STRING, value }
  },
)

export const FIND_LAST = expose(
  `
    @description Returns the last needle found in the haystack

    FIND_LAST(haystack: STRING, ...needles: STRING)
  `,
  (haystack: EvaluationResultString, ...needles: EvaluationResultString[]) => {
    let index = -1
    let value = ''

    for (let needle of needles) {
      let idx = haystack.value.lastIndexOf(needle.value)

      if (idx !== -1 && (index === -1 || idx > index)) {
        index = idx
        value = needle.value
      }
    }

    return { kind: EvaluationResultKind.STRING, value: value }
  },
)

export const REPLACE_ALL = expose(
  `
    @description Replaces all occurrences of the needles with their replacements

    REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)
  `,
  (haystack: EvaluationResultString, ...zip: EvaluationResultString[]) => {
    let values: string[] = []
    let replacements: string[] = []
    for (let idx = 0; idx < zip.length; idx += 2) {
      let value = zip[idx]
      if (value === undefined) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: 'REPLACE_ALL() expects an even number of arguments',
        }
      }

      let replacement = zip[idx + 1]
      if (replacement === undefined) {
        return {
          kind: EvaluationResultKind.ERROR,
          value: 'REPLACE_ALL() expects an even number of arguments',
        }
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
          return {
            kind: EvaluationResultKind.ERROR,
            value: 'REPLACE_ALL() expects an even number of arguments',
          }
        }
        let replacement = replacements[iidx]
        if (replacement === undefined) {
          return {
            kind: EvaluationResultKind.ERROR,
            value: 'REPLACE_ALL() expects an even number of arguments',
          }
        }

        value = value.replace(needle, replacement)
        idx += replacement.length - needle.length
      }
    }

    return {
      kind: EvaluationResultKind.STRING,
      value,
    }
  },
)

export const TEXT_SLICE = expose(
  `
    @description Returns a slice of the string from startIdx to endIdx

    TEXT_SLICE(value: STRING, startIdx: NUMBER, endIdx?: NUMBER)
  `,
  (
    value: EvaluationResultString,
    startIdx: EvaluationResultNumber,
    endIdx?: EvaluationResultNumber,
  ) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: value.value.slice(startIdx.value, endIdx?.value),
    }
  },
)
