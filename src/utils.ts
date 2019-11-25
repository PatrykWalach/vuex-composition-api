export const travel = <R = any>(object: any, keys: string[]): R => {
  const key = keys.shift()

  if (key) {
    if (!object.hasOwnProperty(key)) {
      object[key] = {}
    }
    if (keys.length) {
      return travel(object[key], keys)
    } else {
      return object[key]
    }
  }
  return object
}
