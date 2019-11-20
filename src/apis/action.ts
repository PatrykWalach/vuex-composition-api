export type Action = {
  <R>(fn: (context: any, payload: void) => R): (
    context: any,
    payload: void,
  ) => R
  <R, O>(fn: (context: any, payload: O) => R): (context: any, payload: O) => R
}

export const action: Action = <R, O>(fn: (context: any, payload?: O) => R) => fn
