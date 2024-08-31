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
  type EvaluationResultDateTime,
  EvaluationResultKind,
  type EvaluationResultNumber,
} from '~/domain/evaluation-result'
import { expose } from '../function-utils'

export const NOW = expose(
  `
    @description The current date and time represented as a datetime.
    @example NOW()
    NOW()
  `,
  () => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: new Date(),
      date: true,
      time: true,
    }
  },
)

export const TODAY = expose(
  `
    @description The current date represented as a datetime.
    @example TODAY()
    TODAY()
  `,
  () => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: startOfDay(new Date()),
      date: true,
      time: false,
    }
  },
)

export const TIME = expose(
  `
    @description The current time represented as a datetime.
    @example TIME()
    TIME()
  `,
  () => {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: new Date(),
      date: false,
      time: true,
    }
  },
)

export const DAY = expose(
  `
    @description The day of the month from the given date.
    @param date The date to extract the current day from.
    @example DAY(TODAY())
    DAY(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getDate(date.value) as number }
  },
)

export const MONTH = expose(
  `
    @description The month of the year from the given date.
    @param date The date to extract the current month from.
    @example MONTH(TODAY())
    MONTH(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return { kind: EvaluationResultKind.NUMBER, value: getMonth(date.value) + 1 }
  },
)

export const YEAR = expose(
  `
    @description The year from the given date.
    @param date The date to extract the current year from.
    @example YEAR(TODAY())
    YEAR(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: getYear(date.value),
    }
  },
)

export const HOUR = expose(
  `
    @description The hour of the day from the given date.
    @param date The date to extract the current hour from.
    @example HOUR(NOW())
    HOUR(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: getHours(date.value),
    }
  },
)

export const MINUTE = expose(
  `
    @description The minute of the day from the given date.
    @param date The date to extract the current minute from.
    @example MINUTE(NOW())
    MINUTE(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: getMinutes(date.value),
    }
  },
)

export const SECOND = expose(
  `
    @description The second of the minute from the given date.
    @param date The date to extract the current seconds from.
    @example SECOND(NOW())
    SECOND(date: DATETIME)
  `,
  (date: EvaluationResultDateTime) => {
    return {
      kind: EvaluationResultKind.NUMBER,
      value: getSeconds(date.value),
    }
  },
)

export const ADD_DAYS = expose(
  `
    @description Add days to a date.
    @param date The date to add days to.
    @param days The number of days to add.
    @example ADD_DAYS(TODAY(), 7)
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

export const SUB_DAYS = expose(
  `
    @description Subtract days from a date.
    @param date The date to subtract days from.
    @param days The number of days to subtract.
    @example SUB_DAYS(TODAY(), 7)
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

export const ADD_HOURS = expose(
  `
    @description Add hours to a date.
    @param date The date to add hours to.
    @param hours The number of hours to add.
    @example ADD_HOURS(NOW(), 8)
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

export const SUB_HOURS = expose(
  `
    @description Subtract hours from a date.
    @param date The date to subtract hours from.
    @param hours The number of hours to subtract.
    @example SUB_HOURS(NOW(), 8)
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
