export function ensureMatrix<T>(value: T | T[] | T[][]): T[][] {
  if (!Array.isArray(value)) {
    return [[value]] as T[][]
  }

  if (!Array.isArray(value[0])) {
    return [value] as T[][]
  }

  return value as T[][]
}
