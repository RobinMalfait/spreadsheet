import { type EvaluationResult, EvaluationResultKind } from './evaluation-result'
import * as functions from './functions'

export function matchesTypes<
  T extends EvaluationResult | EvaluationResult[] | EvaluationResult[][],
>(value: T, types: string[]): boolean {
  // 2D
  if (Array.isArray(value) && Array.isArray(value[0])) {
    if (types.includes('T[][]')) return true

    let _types = types.filter((t) => t.endsWith('[][]')).map((t) => t.slice(0, -4))
    if (_types.length === 0) return false

    let grid = value
    for (let row of grid) {
      for (let item of row) {
        if (!matchesTypes(item, _types)) {
          return false
        }
      }
    }

    return true
  }

  // 1D
  if (Array.isArray(value)) {
    if (types.includes('T[]')) return true

    let _types = types
      .filter((t) => t.endsWith('[]') && !t.endsWith('[][]'))
      .map((t) => t.slice(0, -2))
    if (_types.length === 0) return false

    let grid = value
    for (let item of grid) {
      if (!matchesTypes(item, _types)) {
        return false
      }
    }

    return true
  }

  // Unit
  return types.includes(value.kind) || types.includes('T')
}

export function tryCoerceValue<
  T extends EvaluationResult | EvaluationResult[] | EvaluationResult[][],
>(value: T, types: string[]): T | EvaluationResult {
  // 2D
  if (Array.isArray(value) && Array.isArray(value[0])) {
    if (types.includes('T[][]')) return value

    let _types = types.filter((t) => t.endsWith('[][]')).map((t) => t.slice(0, -4))
    if (_types.length === 0) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: `Could not coerce value into expected type (${types.join(' | ')})`,
      }
    }

    let grid = value
    for (let row of grid) {
      for (let [idx, item] of row.entries()) {
        row[idx] = tryCoerceValue(item, _types)
      }
    }

    return grid
  }

  // 1D
  if (Array.isArray(value)) {
    if (types.includes('T[]')) return value

    let _types = types
      .filter((t) => t.endsWith('[]') && !t.endsWith('[][]'))
      .map((t) => t.slice(0, -2))
    if (_types.length === 0) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: `Could not coerce value into expected type (${types.join(' | ')})`,
      }
    }

    let grid = value
    for (let [idx, item] of grid.entries()) {
      grid[idx] = tryCoerceValue(item, _types)
    }

    return grid
  }

  // Unit
  for (let type of types) {
    switch (type) {
      case EvaluationResultKind.STRING: {
        let coerced = functions.AS_STRING(value)
        if (coerced.kind === EvaluationResultKind.STRING) return coerced
        break
      }

      case EvaluationResultKind.NUMBER: {
        let coerced = functions.AS_NUMBER(value)
        if (coerced.kind === EvaluationResultKind.NUMBER) return coerced
        break
      }

      case EvaluationResultKind.BOOLEAN: {
        let coerced = functions.AS_BOOLEAN(value)
        if (coerced.kind === EvaluationResultKind.BOOLEAN) return coerced
        break
      }

      case EvaluationResultKind.DATETIME:
      case EvaluationResultKind.EMPTY:
      case EvaluationResultKind.ERROR:
        return value

      default:
        return {
          kind: EvaluationResultKind.ERROR,
          value: `Could not coerce value into expected type (${types.join(' | ')})`,
        }
    }
  }

  return {
    kind: EvaluationResultKind.ERROR,
    value: `Could not coerce value into expected type (${types.join(' | ')})`,
  }
}
