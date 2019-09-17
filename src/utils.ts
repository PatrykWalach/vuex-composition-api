export const assert = (condition: boolean, msg: string) => {
  if (!condition) {
    throw new Error(`[vuex-composition-api] ${msg}`)
  }
}
