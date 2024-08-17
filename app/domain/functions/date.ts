import {
  addDays,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  startOfDay,
  subDays,
} from 'date-fns'
import { type EvaluationResult, EvaluationResultKind } from '../spreadsheet'

function isDateLike(arg: EvaluationResult): arg is Extract<
  EvaluationResult,
  {
    kind:
      | EvaluationResultKind.DATETIME
      | EvaluationResultKind.DATE
      | EvaluationResultKind.TIME
  }
> {
  return (
    arg.kind === EvaluationResultKind.DATETIME ||
    arg.kind === EvaluationResultKind.DATE ||
    arg.kind === EvaluationResultKind.TIME
  )
}

export function NOW(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    throw Object.assign(new Error('NOW() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.DATETIME, value: new Date() }
}

export function TODAY(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    throw Object.assign(new Error('TODAY() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.DATE, value: startOfDay(new Date()) }
}

export function TIME(...args: EvaluationResult[]): EvaluationResult {
  if (args.length !== 0) {
    throw Object.assign(new Error('TIME() does not take any arguments'), {
      short: '#VALUE!',
    })
  }

  // TIME() – returns the current time
  return { kind: EvaluationResultKind.TIME, value: new Date() }
}

export function DAY(date: EvaluationResult): EvaluationResult {
  if (!isDateLike(date)) {
    throw Object.assign(new Error('DAY() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getDate(date.value) }
}

export function MONTH(date: EvaluationResult): EvaluationResult {
  if (!isDateLike(date)) {
    throw Object.assign(new Error('MONTH() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMonth(date.value) + 1 }
}

export function YEAR(date: EvaluationResult): EvaluationResult {
  if (!isDateLike(date)) {
    throw Object.assign(new Error('YEAR() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getYear(date.value) }
}

export function HOUR(date: EvaluationResult): EvaluationResult {
  if (!isDateLike(date)) {
    throw Object.assign(new Error('HOUR() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getHours(date.value) }
}

export function MINUTE(date: EvaluationResult): EvaluationResult {
  if (!isDateLike(date)) {
    throw Object.assign(new Error('MINUTE() requires a date'), {
      short: '#VALUE!',
    })
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMinutes(date.value) }
}

export function SECOND(date: EvaluationResult): EvaluationResult {
  if (!isDateLike(date)) {
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
  if (!isDateLike(date)) {
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
    kind: EvaluationResultKind.DATE,
    value: addDays(date.value, days.value),
  }
}

export function SUB_DAYS(
  date: EvaluationResult,
  days: EvaluationResult,
): EvaluationResult {
  if (!isDateLike(date)) {
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
    kind: EvaluationResultKind.DATE,
    value: subDays(date.value, days.value),
  }
}
