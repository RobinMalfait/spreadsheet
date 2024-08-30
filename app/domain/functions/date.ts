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

export const NOW = expose('NOW()', {
  description: 'The current date and time',
  handle() {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: new Date(),
      date: true,
      time: true,
    }
  },
})

export const TODAY = expose('TODAY()', {
  description: 'The current date',
  handle() {
    return {
      kind: EvaluationResultKind.DATETIME,
      value: startOfDay(new Date()),
      date: true,
      time: false,
    }
  },
})

export const TIME = expose('TIME()', {
  description: 'The current time',
  handle: () => ({
    kind: EvaluationResultKind.DATETIME,
    value: new Date(),
    date: false,
    time: true,
  }),
})

export const DAY = expose(
  // @describe date The date to extract the day from
  'DAY(date: DATETIME)',
  {
    description: 'The day of the month',
    handle(date: EvaluationResultDateTime) {
      return { kind: EvaluationResultKind.NUMBER, value: getDate(date.value) }
    },
  },
)

export const MONTH = expose(
  // @describe date The date to extract the month from
  'MONTH(date: DATETIME)',
  {
    description: 'The month of the year',
    handle(date: EvaluationResultDateTime) {
      return { kind: EvaluationResultKind.NUMBER, value: getMonth(date.value) + 1 }
    },
  },
)

export const YEAR = expose(
  // @describe date The date to extract the year from
  'YEAR(date: DATETIME)',
  {
    description: 'The year',
    handle(date: EvaluationResultDateTime) {
      return { kind: EvaluationResultKind.NUMBER, value: getYear(date.value) }
    },
  },
)

export const HOUR = expose(
  // @describe date The date to extract the hour from
  'HOUR(date: DATETIME)',
  {
    description: 'The hour',
    handle(date: EvaluationResultDateTime) {
      return { kind: EvaluationResultKind.NUMBER, value: getHours(date.value) }
    },
  },
)

export const MINUTE = expose(
  // @describe date The date to extract the minute from
  'MINUTE(date: DATETIME)',
  {
    description: 'The minute',
    handle(date: EvaluationResultDateTime) {
      return { kind: EvaluationResultKind.NUMBER, value: getMinutes(date.value) }
    },
  },
)

export const SECOND = expose(
  // @describe date The date to extract the second from
  'SECOND(date: DATETIME)',
  {
    description: 'The second',
    handle(date: EvaluationResultDateTime) {
      return { kind: EvaluationResultKind.NUMBER, value: getSeconds(date.value) }
    },
  },
)

export const ADD_DAYS = expose(
  // @describe date The date to add days to
  // @describe days The number of days to add
  'ADD_DAYS(date: DATETIME, days: NUMBER)',
  {
    description: 'Add days to a date',
    handle(date: EvaluationResultDateTime, days: EvaluationResultNumber) {
      return {
        kind: EvaluationResultKind.DATETIME,
        value: addDays(date.value, days.value),
        date: true,
        time: date.time,
      }
    },
  },
)

export const SUB_DAYS = expose(
  // @describe date The date to subtract days from
  // @describe days The number of days to subtract
  'SUB_DAYS(date: DATETIME, days: NUMBER)',
  {
    description: 'Subtract days from a date',
    handle(date: EvaluationResultDateTime, days: EvaluationResultNumber) {
      return {
        kind: EvaluationResultKind.DATETIME,
        value: subDays(date.value, days.value),
        date: true,
        time: date.time,
      }
    },
  },
)

export const ADD_HOURS = expose(
  // @describe date The date to add hours to
  // @describe hours The number of hours to add
  'ADD_HOURS(date: DATETIME, hours: NUMBER)',
  {
    description: 'Add hours to a date',
    handle(date: EvaluationResultDateTime, hours: EvaluationResultNumber) {
      return {
        kind: EvaluationResultKind.DATETIME,
        value: addHours(date.value, hours.value),
        date: date.date,
        time: true,
      }
    },
  },
)

export const SUB_HOURS = expose(
  // @describe date The date to subtract hours from
  // @describe hours The number of hours to subtract
  'SUB_HOURS(date: DATETIME, hours: NUMBER)',
  {
    description: 'Subtract hours from a date',
    handle(date: EvaluationResultDateTime, hours: EvaluationResultNumber) {
      return {
        kind: EvaluationResultKind.DATETIME,
        value: subHours(date.value, hours.value),
        date: date.date,
        time: true,
      }
    },
  },
)
