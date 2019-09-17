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

export type Mutation = <R, S extends Record<string, State<any>>, O = void>(
  module: Module<any>,
  name: string,
  state: S,
  fn: (state: inferState<S>, payload: O) => R,
) => (payload: O) => R

export type BoundMutation = <R, S extends Record<string, State<any>>, O = void>(
  name: string,
  state: S,
  fn: (state: inferState<S>, payload: O) => R,
) => (payload: O) => R

export const mutation: Mutation = (module, _name, state, fn) => {
  const name = (module.options.namespaced ? module.name + '/' : '') + _name
  module._mutations[_name] = fn

  return payload => {
    module._subscribers.forEach(callback => callback(name, state, payload))
    return fn(mutable(state), payload)
  }
}
