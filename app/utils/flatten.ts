type Root<T> = T extends Array<infer U> ? Root<U> : T

export function* flatten<T>(values: T): Generator<Root<T>> {
  if (Array.isArray(values)) {
    for (let value of values) {
      yield* flatten(value)
    }
  } else {
    yield values as Root<T>
  }
}
