import { State } from './state'
import { Module } from '../module'

export type inferState<S extends Record<string, State<any>> | undefined> = {
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
      state[prop]._replace(_value)
      return true
    },
  }) as inferState<S>

export type BoundMutation = <
  S extends Record<string, State<any>>,
  O = undefined
>(
  name: string,
  state: S,
  fn: (state: inferState<S>, payload: O) => void,
) => (payload: O) => void

export type Mutation = <S extends Record<string, State<any>>, O = undefined>(
  module: Module<any>,
  name: string,
  state: S,
  fn: (state: inferState<S>, payload: O) => void,
) => (payload: O) => void

export const mutation: Mutation = (module, name, state, fn) => {
  module._mutations[name] = fn

  return payload => {
    if (module._store) {
      const type = (module.options.namespaced ? module.name + '/' : '') + name
      module._store({ type, payload }, state)
    } else {
      fn(mutable(state), payload)
    }

    module._subscribers.forEach(callback =>
      callback({ type: name, payload }, state),
    )
  }
}
