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
  handle: () => ({
    kind: EvaluationResultKind.DATETIME,
    value: new Date(),
    date: true,
    time: true,
  }),
})

export const TODAY = expose('TODAY()', {
  description: 'The current date',
  handle: () => ({
    kind: EvaluationResultKind.DATETIME,
    value: startOfDay(new Date()),
    date: true,
    time: false,
  }),
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

export const DAY = expose('DAY(date: DATETIME)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to extract the day from',
  //   },
  // ],
  description: 'The day of the month',
  handle: (date: EvaluationResultDateTime) => ({
    kind: EvaluationResultKind.NUMBER,
    value: getDate(date.value),
  }),
})

export const MONTH = expose('MONTH(date: DATETIME)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to extract the month from',
  //   },
  // ],
  description: 'The month of the year',
  handle: (date: EvaluationResultDateTime) => ({
    kind: EvaluationResultKind.NUMBER,
    value: getMonth(date.value) + 1,
  }),
})

export const YEAR = expose('YEAR(date: DATETIME)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to extract the year from',
  //   },
  // ],
  description: 'The year',
  handle: (date: EvaluationResultDateTime) => ({
    kind: EvaluationResultKind.NUMBER,
    value: getYear(date.value),
  }),
})

export const HOUR = expose('HOUR(date: DATETIME)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to extract the hour from',
  //   },
  // ],
  description: 'The hour',
  handle: (date: EvaluationResultDateTime) => ({
    kind: EvaluationResultKind.NUMBER,
    value: getHours(date.value),
  }),
})

export const MINUTE = expose('MINUTE(date: DATETIME)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to extract the minute from',
  //   },
  // ],
  description: 'The minute',
  handle: (date: EvaluationResultDateTime) => ({
    kind: EvaluationResultKind.NUMBER,
    value: getMinutes(date.value),
  }),
})

export const SECOND = expose('SECOND(date: DATETIME)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to extract the second from',
  //   },
  // ],
  description: 'The second',
  handle: (date: EvaluationResultDateTime) => ({
    kind: EvaluationResultKind.NUMBER,
    value: getSeconds(date.value),
  }),
})

export const ADD_DAYS = expose('ADD_DAYS(date: DATETIME, days: NUMBER)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to add days to',
  //   },
  //   {
  //     kind: EvaluationResultKind.NUMBER,
  //     name: 'days',
  //     description: 'The number of days to add',
  //   },
  // ],
  description: 'Add days to a date',
  handle: (date: EvaluationResultDateTime, days: EvaluationResultNumber) => ({
    kind: EvaluationResultKind.DATETIME,
    value: addDays(date.value, days.value),
    date: true,
    time: date.time,
  }),
})

export const SUB_DAYS = expose('SUB_DAYS(date: DATETIME, days: NUMBER)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to subtract days from',
  //   },
  //   {
  //     kind: EvaluationResultKind.NUMBER,
  //     name: 'days',
  //     description: 'The number of days to subtract',
  //   },
  // ],
  description: 'Subtract days from a date',
  handle: (date: EvaluationResultDateTime, days: EvaluationResultNumber) => ({
    kind: EvaluationResultKind.DATETIME,
    value: subDays(date.value, days.value),
    date: true,
    time: date.time,
  }),
})

export const ADD_HOURS = expose('ADD_HOURS(date: DATETIME, hours: NUMBER)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to add hours to',
  //   },
  //   {
  //     kind: EvaluationResultKind.NUMBER,
  //     name: 'hours',
  //     description: 'The number of hours to add',
  //   },
  // ],
  description: 'Add hours to a date',
  handle: (date: EvaluationResultDateTime, hours: EvaluationResultNumber) => ({
    kind: EvaluationResultKind.DATETIME,
    value: addHours(date.value, hours.value),
    date: date.date,
    time: true,
  }),
})

export const SUB_HOURS = expose('SUB_HOURS(date: DATETIME, hours: NUMBER)', {
  // args: [
  //   {
  //     kind: EvaluationResultKind.DATETIME,
  //     name: 'date',
  //     description: 'The date to subtract hours from',
  //   },
  //   {
  //     kind: EvaluationResultKind.NUMBER,
  //     name: 'hours',
  //     description: 'The number of hours to subtract',
  //   },
  // ],
  description: 'Subtract hours from a date',
  handle: (date: EvaluationResultDateTime, hours: EvaluationResultNumber) => ({
    kind: EvaluationResultKind.DATETIME,
    value: subHours(date.value, hours.value),
    date: date.date,
    time: true,
  }),
})
