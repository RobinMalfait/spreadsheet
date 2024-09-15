import { printEvaluationResult } from '~/domain/evaluation'
import {
  EvaluationResultKind,
  type EvaluationResultNumber,
  type EvaluationResultString,
} from '~/domain/evaluation-result'
import { expose } from '~/domain/function-utils'
import { flatten } from '~/utils/flatten'

export const CONCAT = expose(
  `
    @description Concatenates multiple strings together.
    @param values The strings to concatenate.
    @example CONCAT("hello", " ", "world")
    CONCAT(...values: T)
  `,
  (...values) => {
    let out = ''

    for (let value of flatten(values)) {
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

    for (let value of flatten(values)) {
      out.push(printEvaluationResult(value))
    }

    return { kind: EvaluationResultKind.STRING, value: out.join(delimiter.value) }
  },
)

export const SPLIT = expose(
  `
    @description Splits a string into an array of substrings separated by a delimiter.
    @param value The string to split.
    @param delimiter The string to split by.
    @example SPLIT("Hello World", " ")
    SPLIT(value: STRING, delimiter: STRING)
  `,
  (value: EvaluationResultString, delimiter: EvaluationResultString) => {
    return value.value.split(delimiter.value).map((value) => {
      return {
        kind: EvaluationResultKind.STRING,
        value,
      }
    })
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
    FIND_FIRST(haystack: STRING, ...needles: STRING)
  `,
  (haystack: EvaluationResultString, ...needles: EvaluationResultString[]) => {
    let index = -1
    let value = ''

    for (let needle of flatten(needles)) {
      let idx = haystack.value.indexOf(needle.value)

      if (idx !== -1 && (index === -1 || idx < index)) {
        index = idx
        value = needle.value
      }
    }

    if (index === -1) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'Could not find any of the needles in the haystack.',
      }
    }

    return { kind: EvaluationResultKind.STRING, value }
  },
)

export const FIND_FIRST_INDEX = expose(
  `
    @description Returns the position of the first needle found in the haystack.
    @param haystack The string to search in.
    @param needles The strings to search for.
    @example FIND_FIRST_INDEX("The quick brown fox jumps over the lazy dog", "fox", "dog")
    @example FIND_FIRST_INDEX("The quick brown fox jumps over the lazy dog", "dog", "fox")
    FIND_FIRST_INDEX(haystack: STRING, ...needles: STRING)
  `,
  (haystack: EvaluationResultString, ...needles: EvaluationResultString[]) => {
    let index = -1

    for (let needle of flatten(needles)) {
      let idx = haystack.value.indexOf(needle.value)

      if (idx !== -1 && (index === -1 || idx < index)) {
        index = idx
      }
    }

    if (index === -1) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'Could not find any of the needles in the haystack.',
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: index }
  },
)

export const FIND_LAST = expose(
  `
    @description Returns the last needle found in the haystack.
    @param haystack The string to search in.
    @param needles The strings to search for.
    @example FIND_LAST("The quick brown fox jumps over the lazy dog", "fox", "dog")
    @example FIND_LAST("The quick brown fox jumps over the lazy dog", "dog", "fox")
    FIND_LAST(haystack: STRING, ...needles: STRING)
  `,
  (haystack: EvaluationResultString, ...needles: EvaluationResultString[]) => {
    let index = -1
    let value = ''

    for (let needle of flatten(needles)) {
      let idx = haystack.value.lastIndexOf(needle.value)

      if (idx !== -1 && (index === -1 || idx > index)) {
        index = idx
        value = needle.value
      }
    }

    if (index === -1) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'Could not find any of the needles in the haystack.',
      }
    }

    return { kind: EvaluationResultKind.STRING, value: value }
  },
)

export const FIND_LAST_INDEX = expose(
  `
    @description Returns the position of the last needle found in the haystack.
    @param haystack The string to search in.
    @param needles The strings to search for.
    @example FIND_LAST_INDEX("The quick brown fox jumps over the lazy dog", "fox", "dog")
    @example FIND_LAST_INDEX("The quick brown fox jumps over the lazy dog", "dog", "fox")
    FIND_LAST_INDEX(haystack: STRING, ...needles: STRING)
  `,
  (haystack: EvaluationResultString, ...needles: EvaluationResultString[]) => {
    let index = -1

    for (let needle of flatten(needles)) {
      let idx = haystack.value.lastIndexOf(needle.value)

      if (idx !== -1 && (index === -1 || idx > index)) {
        index = idx
      }
    }

    if (index === -1) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: 'Could not find any of the needles in the haystack.',
      }
    }

    return { kind: EvaluationResultKind.NUMBER, value: index }
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

export const CHAR_CODE_AT = expose(
  `
    @description Get the character code at a specific index in a string.
    @param value The string to get the character code from.
    @param index The index of the character to get the character code from.
    @example CHAR_CODE_AT("ABC", 0)
    @example CHAR_CODE_AT("ABC", 1)
    @example CHAR_CODE_AT("ABC", 2)
    CHAR_CODE_AT(value: STRING, index: NUMBER)
  `,
  (value: EvaluationResultString, index: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: value.value.charCodeAt(index.value),
    }
  },
)
