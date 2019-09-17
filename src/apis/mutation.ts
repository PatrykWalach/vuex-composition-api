import { State } from './state'

export type inferState<S extends Record<string, State<any>>> = {
  [K in keyof S]: S[K] extends State<infer T> ? T : unknown
}

export const mutable = <S extends Record<string, State<any>>>(
  state: S,
): inferState<S> =>
  new Proxy(state, {
    get: (state, prop: keyof typeof state) => {
      return state[prop] && state[prop].value
    },
    set: (state, prop: keyof typeof state, _value) => {
      state[prop].replace(_value)
      return true
    },
  }) as inferState<S>

export type MutationWrapper = <O, R, S extends Record<string, State<any>>>(
  name: string,
  state: S,
  fn: (state: inferState<S>, payload: O) => R,
) => (payload: O) => R
