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
import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation'

export function NOW(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    throw Object.assign(new Error('NOW() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: new Date(),
    date: true,
    time: true,
  }
}

export function TODAY(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    throw Object.assign(new Error('TODAY() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: startOfDay(new Date()),
    date: true,
    time: false,
  }
}

export function TIME(...args: EvaluationResult[]): EvaluationResult {
  if (args.length !== 0) {
    throw Object.assign(new Error('TIME() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: new Date(),
    date: false,
    time: true,
  }
}

export function DAY(date: EvaluationResult): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('DAY() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getDate(date.value) }
}

export function MONTH(date: EvaluationResult): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('MONTH() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMonth(date.value) + 1 }
}

export function YEAR(date: EvaluationResult): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('YEAR() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getYear(date.value) }
}

export function HOUR(date: EvaluationResult): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('HOUR() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getHours(date.value) }
}

export function MINUTE(date: EvaluationResult): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('MINUTE() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMinutes(date.value) }
}

export function SECOND(date: EvaluationResult): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('SECOND() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getSeconds(date.value) }
}

export function ADD_DAYS(
  date: EvaluationResult,
  days: EvaluationResult,
): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('ADD_DAYS() requires a date'), {
      short: '#VALUE!',
    })
  }

  if (days.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(new Error('ADD_DAYS() requires a number of days'), {
      short: '#VALUE!',
    })
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: addDays(date.value, days.value),
    date: true,
    time: date.time,
  }
}

export function SUB_DAYS(
  date: EvaluationResult,
  days: EvaluationResult,
): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('SUB_DAYS() requires a date'), {
      short: '#VALUE!',
    })
  }

  if (days.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(new Error('SUB_DAYS() requires a number of days'), {
      short: '#VALUE!',
    })
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: subDays(date.value, days.value),
    date: true,
    time: date.time,
  }
}

export function ADD_HOURS(
  date: EvaluationResult,
  hours: EvaluationResult,
): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('ADD_HOURS() requires a date'), {
      short: '#VALUE!',
    })
  }

  if (hours.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(new Error('ADD_HOURS() requires a number of hours'), {
      short: '#VALUE!',
    })
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: addHours(date.value, hours.value),
    date: date.date,
    time: true,
  }
}

export function SUB_HOURS(
  date: EvaluationResult,
  hours: EvaluationResult,
): EvaluationResult {
  if (date.kind !== EvaluationResultKind.DATETIME) {
    throw Object.assign(new Error('SUB_HOURS() requires a date'), {
      short: '#VALUE!',
    })
  }

  if (hours.kind !== EvaluationResultKind.NUMBER) {
    throw Object.assign(new Error('SUB_HOURS() requires a number of hours'), {
      short: '#VALUE!',
    })
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: subHours(date.value, hours.value),
    date: date.date,
    time: true,
  }
}
