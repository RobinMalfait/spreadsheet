import {
  addDays,
  addHours,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  startOfDay,
  subDays,
  subHours,
} from 'date-fns'
import {
  type EvaluationResult,
  type EvaluationResultDateTime,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '../function-utils'

export const NOW = expose(
  `
    @description The current date and time

    NOW()
  `,
  () => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: new Date(),
      date: true,
      time: true,
    } satisfies EvaluationResult
  },
)

export const TODAY = expose(
  `
    @description The current date

    TODAY()
  `,
  () => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: startOfDay(new Date()),
      date: true,
      time: false,
    } satisfies EvaluationResult
  },
)

export const TIME = expose(
  `
    @description The current time

    TIME()
  `,
  () => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: new Date(),
      date: false,
      time: true,
    } satisfies EvaluationResult
  },
)

// @describe date The date to extract the day from
export const DAY = expose(
  `
    @description The day of the month

    DAY(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getDate(date.value) }
  },
)

// @describe date The date to extract the month from
export const MONTH = expose(
  `
    @description The month of the year

    MONTH(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getMonth(date.value) + 1 }
  },
)

// @describe date The date to extract the year from
export const YEAR = expose(
  `
    @description The year

    YEAR(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getYear(date.value) }
  },
)

// @describe date The date to extract the hour from
export const HOUR = expose(
  `
    @description The hour

    HOUR(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getHours(date.value) }
  },
)

// @describe date The date to extract the minute from
export const MINUTE = expose(
  `
    @description The minute

    MINUTE(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getMinutes(date.value) }
  },
)

// @describe date The date to extract the second from
export const SECOND = expose(
  `
    @description The second

    SECOND(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getSeconds(date.value) }
  },
)

// @describe date The date to add days to
// @describe days The number of days to add
export const ADD_DAYS = expose(
  `
    @description Add days to a date

    ADD_DAYS(date: DATETIME, days: NUMBER)
  `,
  (date: EvaluationResultDateTime, days: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: addDays(date.value, days.value),
      date: true,
      time: date.time,
    }
  },
)

// @describe date The date to subtract days from
// @describe days The number of days to subtract
export const SUB_DAYS = expose(
  `
    @description Subtract days from a date

    SUB_DAYS(date: DATETIME, days: NUMBER)
  `,
  (date: EvaluationResultDateTime, days: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: subDays(date.value, days.value),
      date: true,
      time: date.time,
    }
  },
)

// @describe date The date to add hours to
// @describe hours The number of hours to add
export const ADD_HOURS = expose(
  `
    @description Add hours to a date

    ADD_HOURS(date: DATETIME, hours: NUMBER)
  `,
  (date: EvaluationResultDateTime, hours: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: addHours(date.value, hours.value),
      date: date.date,
      time: true,
    }
  },
)

// @describe date The date to subtract hours from
// @describe hours The number of hours to subtract
export const SUB_HOURS = expose(
  `
    @description Subtract hours from a date

    SUB_HOURS(date: DATETIME, hours: NUMBER)
  `,
  (date: EvaluationResultDateTime, hours: EvaluationResultNumber) => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: subHours(date.value, hours.value),
      date: date.date,
      time: true,
    }
  },
)
