import { printEvaluationResult } from '~/domain/evaluation'
import {
  EvaluationResultKind,
  type EvaluationResultNumber,
  type EvaluationResultString,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'

export const CONCAT = expose(
  `
    @description Concatenates multiple strings together.
    @param values The strings to concatenate.
    @example CONCAT("hello", " ", "world")
    CONCAT(...values: T)
  `,
  (...values) => {
    let out = ''

    for (let value of values) {
      out += printEvaluationResult(value)
    }

    return { kind: EvaluationResultKind.STRING, value: out }
  },
)

export const JOIN = expose(
  `
    @description Joins multiple strings together with a delimiter.
    @param delimiter The string to insert between each value.
    @param values The values to join.
    @example JOIN("-", 1, 2, "hello", "world", TRUE())
    JOIN(delimiter: STRING, ...values: T)
  `,
  (delimiter: EvaluationResultString, ...values) => {
    let out: string[] = []

    for (let value of values) {
      out.push(printEvaluationResult(value))
    }

    return { kind: EvaluationResultKind.STRING, value: out.join(delimiter.value) }
  },
)

export const LOWER = expose(
  `
    @description Converts a string to lowercase.
    @param value The string to convert.
    @example LOWER("Hello, World!")
    LOWER(value: T)
  `,
  (value) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: printEvaluationResult(value).toLowerCase(),
    }
  },
)

export const UPPER = expose(
  `
    @description Converts a string to uppercase.
    @param value The string to convert.
    @example UPPER("Hello, World!")
    UPPER(value: T)
  `,
  (value) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: printEvaluationResult(value).toUpperCase(),
    }
  },
)

export const LEN = expose(
  `
    @description Returns the length of a string.
    @param value The string to measure.
    @example LEN("Hello, World!")
    LEN(value: STRING)
  `,
  (value: EvaluationResultString) => {
    return { kind: EvaluationResultKind.NUMBER, value: value.value.length }
  },
)

export const TRIM = expose(
  `
    @description Removes leading and trailing whitespace from a string.
    @param value The string to trim.
    @example TRIM("  Hello, World!  ")
    TRIM(value: STRING)
  `,
  (value: EvaluationResultString) => {
    return { kind: EvaluationResultKind.STRING, value: value.value.trim() }
  },
)

export const FIND_FIRST = expose(
  `
    @description Returns the first needle found in the haystack.
    @param haystack The string to search in.
    @param needles The strings to search for.
    @example FIND_FIRST("The quick brown fox jumps over the lazy dog", "fox", "dog")
    @example FIND_FIRST("The quick brown fox jumps over the lazy dog", "dog", "fox")
    FIND_FIRST(haystack: STRING, ...needles: STRING | NUMBER)
  `,
  (
    haystack: EvaluationResultString,
    ...needles: (EvaluationResultString | EvaluationResultNumber)[]
  ) => {
    let index = -1
    let value = ''

    for (let needle of needles) {
      let idx = haystack.value.indexOf(needle.value.toString())

      if (idx !== -1 && (index === -1 || idx < index)) {
        index = idx
        value = needle.value.toString()
      }
    }

    return { kind: EvaluationResultKind.STRING, value }
  },
)

export const FIND_LAST = expose(
  `
    @description Returns the last needle found in the haystack.
    @param haystack The string to search in.
    @param needles The strings to search for.
    @example FIND_LAST("The quick brown fox jumps over the lazy dog", "fox", "dog")
    @example FIND_LAST("The quick brown fox jumps over the lazy dog", "dog", "fox")
    FIND_LAST(haystack: STRING, ...needles: STRING | NUMBER)
  `,
  (
    haystack: EvaluationResultString,
    ...needles: (EvaluationResultString | EvaluationResultNumber)[]
  ) => {
    let index = -1
    let value = ''

    for (let needle of needles) {
      let idx = haystack.value.lastIndexOf(needle.value.toString())

      if (idx !== -1 && (index === -1 || idx > index)) {
        index = idx
        value = needle.value.toString()
      }
    }

    return { kind: EvaluationResultKind.STRING, value: value }
  },
)

export const REPLACE_ALL = expose(
  `
    @description Replaces all occurrences of the needles with their replacements.
    @param haystack The string to search in.
    @param zip The strings to search for and their replacements.
    @example REPLACE_ALL("The quick brown fox jumps over the lazy dog", "fox", "cat", "dog", "wolf")
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
    @description Returns a section of a string.
    @param value The string to slice.
    @param start The index to the beginning of the specified portion of the \`value\`.
    @param end The index to the end of the specified portion of the \`value\`. The substring includes the characters up to, but not including, the character indicated by \`end\`. If this value is not specified, the substring continues to the end of the \`value\`.
    @example TEXT_SLICE("The quick brown fox jumps over the lazy dog", 0, 19)
    @example TEXT_SLICE("The quick brown fox jumps over the lazy dog", 40)
    @example TEXT_SLICE("The quick brown fox jumps over the lazy dog", -3)
    @example TEXT_SLICE("The quick brown fox jumps over the lazy dog", 10, 19)
    TEXT_SLICE(value: STRING, start: NUMBER, end?: NUMBER)
  `,
  (
    value: EvaluationResultString,
    start: EvaluationResultNumber,
    end?: EvaluationResultNumber,
  ) => {
    return {
      kind: EvaluationResultKind.STRING,
      value: value.value.slice(start.value, end?.value),
    }
  },
)
