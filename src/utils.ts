export const travel = <R = any>(object: any, keys: string[]): R => {
  const key = keys.shift()

  if (key) {
    if (!object.hasOwnProperty(key)) {
      object[key] = {}
    }

    return travel(object[key], keys)
  }
  return object
}
export const assert = (condition: any, error: string) => {
  if (!condition) {
    throw new Error(`[vuex-composition-api] ${error}`)
  }
}
