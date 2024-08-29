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
import { type EvaluationResult, EvaluationResultKind } from '~/domain/evaluation-result'

export function NOW(...args: EvaluationResult[]): EvaluationResult {
  if (args.length > 0) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'NOW() does not take any arguments',
    }
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
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'TODAY() does not take any arguments',
    }
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
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'TIME() does not take any arguments',
    }
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
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'DAY() does not take more than one argument',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'DAY() requires a date' }
  }

  return { kind: EvaluationResultKind.NUMBER, value: getDate(date.value) }
}

export function MONTH(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'MONTH() does not take more than one argument',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'MONTH() requires a date' }
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMonth(date.value) + 1 }
}

export function YEAR(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'YEAR() does not take more than one argument',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'YEAR() requires a date' }
  }

  return { kind: EvaluationResultKind.NUMBER, value: getYear(date.value) }
}

export function HOUR(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'HOUR() does not take more than one argument',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'HOUR() requires a date' }
  }

  return { kind: EvaluationResultKind.NUMBER, value: getHours(date.value) }
}

export function MINUTE(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'MINUTE() does not take more than one argument',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'MINUTE() requires a date' }
  }

  return { kind: EvaluationResultKind.NUMBER, value: getMinutes(date.value) }
}

export function SECOND(
  date?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'SECOND() does not take more than one argument',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'SECOND() requires a date' }
  }

  return { kind: EvaluationResultKind.NUMBER, value: getSeconds(date.value) }
}

export function ADD_DAYS(
  date?: EvaluationResult,
  days?: EvaluationResult,
  extra?: EvaluationResult,
): EvaluationResult {
  if (extra) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'ADD_DAYS() does not take more than two arguments',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'ADD_DAYS() requires a date' }
  }

  if (days?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'ADD_DAYS() requires a number of days',
    }
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
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'SUB_DAYS() does not take more than two arguments',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'SUB_DAYS() requires a date' }
  }

  if (days?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'SUB_DAYS() requires a number of days',
    }
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
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'ADD_HOURS() does not take more than two arguments',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'ADD_HOURS() requires a date' }
  }

  if (hours?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'ADD_HOURS() requires a number of hours',
    }
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
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'SUB_HOURS() does not take more than two arguments',
    }
  }

  if (date?.kind !== EvaluationResultKind.DATETIME) {
    return { kind: EvaluationResultKind.ERROR, value: 'SUB_HOURS() requires a date' }
  }

  if (hours?.kind !== EvaluationResultKind.NUMBER) {
    return {
      kind: EvaluationResultKind.ERROR,
      value: 'SUB_HOURS() requires a number of hours',
    }
  }

  return {
    kind: EvaluationResultKind.DATETIME,
    value: subHours(date.value, hours.value),
    date: date.date,
    time: true,
  }
}
