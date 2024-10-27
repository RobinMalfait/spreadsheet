import { type EvaluationResult, EvaluationResultKind } from './evaluation-result'
import * as functions from './functions'
import type { Signature } from './signature/parser'

export function resolveTypesAt(
  args: Signature['args'],
  idx: number,
): [types: string[], variadic: boolean] {
  for (let [i, arg] of args.slice(0, idx + 1).entries()) {
    if (arg.variadic) {
      return [arg.types, true]
    }

    if (arg.variadic || i === idx) {
      return [arg.types, false]
    }
  }

  return [[], false]
}

export function matchesTypes(
  value: EvaluationResult | EvaluationResult[] | EvaluationResult[][],
  types: string[],
): boolean {
  // 2D
  if (Array.isArray(value) && Array.isArray(value[0])) {
    if (types.includes('T[][]')) {
      return true
    }

    let _types = []
    for (let type of types) {
      if (type.endsWith('[][]')) {
        _types.push(type.slice(0, -4))
      }
    }

    if (_types.length === 0) {
      return false
    }

    let grid = value as EvaluationResult[][]
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
    if (types.includes('T[]')) {
      return true
    }

    let _types = []
    for (let type of types) {
      if (type.endsWith('[]') && !type.endsWith('[][]')) {
        _types.push(type.slice(0, -2))
      }
    }

    if (_types.length === 0) {
      return false
    }

    let grid = value as EvaluationResult[]
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
    if (types.includes('T[][]')) {
      return value
    }

    let _types = []
    for (let type of types) {
      if (type.endsWith('[][]')) {
        _types.push(type.slice(0, -4))
      }
    }

    if (_types.length === 0) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: `Could not coerce value \`${valueToType(value).join(' | ')}\` into expected type \`${types.join(' | ')}\``,
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
    if (types.includes('T[]')) {
      return value
    }

    let _types = []
    for (let type of types) {
      if (type.endsWith('[]') && !type.endsWith('[][]')) {
        _types.push(type.slice(0, -2))
      }
    }

    if (_types.length === 0) {
      return {
        kind: EvaluationResultKind.ERROR,
        value: `Could not coerce value \`${valueToType(value).join(' | ')}\` into expected type \`${types.join(' | ')}\``,
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
          value: `Could not coerce value \`${valueToType(value).join(' | ')}\` into expected type \`${types.join(' | ')}\``,
        }
    }
  }

  return {
    kind: EvaluationResultKind.ERROR,
    value: `Could not coerce value \`${valueToType(value).join(' | ')}\` into expected type \`${types.join(' | ')}\``,
  }
}

function valueToType(
  value: EvaluationResult | EvaluationResult[] | EvaluationResult[][],
): string[] {
  // 2D
  if (Array.isArray(value) && Array.isArray(value[0])) {
    let types = new Set()
    let values = value as EvaluationResult[][]

    for (let row of values) {
      for (let item of row) {
        types.add(item.kind)
      }
    }

    return Array.from(types).map((t) => `${t}[][]`)
  }

  // 1D
  if (Array.isArray(value)) {
    let types = new Set()
    let values = value as EvaluationResult[]

    for (let item of values) {
      types.add(item.kind)
    }

    return Array.from(types).map((t) => `${t}[]`)
  }

  // Unit
  return [value.kind]
}
