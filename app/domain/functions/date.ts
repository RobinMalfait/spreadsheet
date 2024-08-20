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
    throw new Error('NOW() does not take any arguments')
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
    throw new Error('TODAY() does not take any arguments')
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
    throw new Error('TIME() does not take any arguments')
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: new Date(),
    date: false,
    time: true,
  }
}

export function DAY(date?: EvaluationResult, extra?: EvaluationResult): EvaluationResult {
  if (extra) {
    throw new Error('DAY() does not take more than one argument')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('DAY() requires a date')
  }

  return { kind: EvaluationResultKind.NUMBER, value: getDate(date.value) }
}

export function MONTH(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('MONTH() does not take more than one argument')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('MONTH() requires a date')
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMonth(date.value) + 1 }
}

export function YEAR(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('YEAR() does not take more than one argument')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('YEAR() requires a date')
  }

  return { kind: EvaluationResultKind.NUMBER, value: getYear(date.value) }
}

export function HOUR(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('HOUR() does not take more than one argument')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('HOUR() requires a date')
  }

  return { kind: EvaluationResultKind.NUMBER, value: getHours(date.value) }
}

export function MINUTE(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('MINUTE() does not take more than one argument')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('MINUTE() requires a date')
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMinutes(date.value) }
}

export function SECOND(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('SECOND() does not take more than one argument')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('SECOND() requires a date')
  }

  return { kind: EvaluationResultKind.NUMBER, value: getSeconds(date.value) }
}

export function ADD_DAYS(
  date?: EvaluationResult,
  days?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('ADD_DAYS() does not take more than two arguments')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('ADD_DAYS() requires a date')
  }

  if (days?.kind !== EvaluationResultKind.NUMBER) {
    throw new Error('ADD_DAYS() requires a number of days')
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: addDays(date.value, days.value),
    date: true,
    time: date.time,
  }
}

export function SUB_DAYS(
  date?: EvaluationResult,
  days?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('SUB_DAYS() does not take more than two arguments')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('SUB_DAYS() requires a date')
  }

  if (days?.kind !== EvaluationResultKind.NUMBER) {
    throw new Error('SUB_DAYS() requires a number of days')
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: subDays(date.value, days.value),
    date: true,
    time: date.time,
  }
}

export function ADD_HOURS(
  date?: EvaluationResult,
  hours?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('ADD_HOURS() does not take more than two arguments')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('ADD_HOURS() requires a date')
  }

  if (hours?.kind !== EvaluationResultKind.NUMBER) {
    throw new Error('ADD_HOURS() requires a number of hours')
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: addHours(date.value, hours.value),
    date: date.date,
    time: true,
  }
}

export function SUB_HOURS(
  date?: EvaluationResult,
  hours?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    throw new Error('SUB_HOURS() does not take more than two arguments')
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    throw new Error('SUB_HOURS() requires a date')
  }

  if (hours?.kind !== EvaluationResultKind.NUMBER) {
    throw new Error('SUB_HOURS() requires a number of hours')
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: subHours(date.value, hours.value),
    date: date.date,
    time: true,
  }
}
