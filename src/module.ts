import { state, State } from './apis/state'
import { getter, Getter } from './apis/getter'
import { inferState, mutable } from './apis/mutation'

import { Module as VuexModule, Mutation } from 'vuex'
import { Ref } from '@vue/composition-api'
import { MutationWrapper } from './apis/mutation'

// extends State<T> | Function | Mutation | Ref<T>
export type SetupReturnType = {
  state: Record<string, State<any>>
  getters?: Record<string, Getter<any>>
  mutations?: Record<string, Mutation<any>>
  actions?: Record<string, Function>
}

export type Setup<R extends SetupReturnType> = (options: {
  mutation: MutationWrapper
  state: <T>(value: T) => State<T>
  getter: <T>(value: T) => Ref<T>
}) => R

export type Subscriber = <S extends Record<string, State<any>>, P>(
  name: string,
  state: S,
  payload: P,
) => any

export class Module<R extends SetupReturnType> {
  name: string
  content: R
  options: { namespaced?: boolean } = {}
  subscribers: Subscriber[] = []
  _mutations: Record<string, (state: inferState<any>, payload: any) => any> = {}

  constructor({
    name,
    setup,
    namespaced = false,
  }: {
    name: string
    setup: Setup<R>
    namespaced?: boolean
  }) {
    this.name = name
    this.options = { namespaced }

    const module = this

    const { subscribe: _subscribe } = this

    const mutation: MutationWrapper = (_name, state, fn) => {
      const name = (namespaced ? this.name + '/' : '') + _name
      this._mutations[_name] = fn

      return function mutation(payload) {
        module.subscribers.forEach(callback => callback(name, state, payload))
        return fn(mutable(state), payload)
      }
    }

    this.subscribe = function boundSubscribe(subscription) {
      return _subscribe.call(module, subscription)
    }

    this.content = setup({ mutation, state, getter })
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber)
  }

  get state(): R['state'] {
    return this.content.state
  }

  get getters(): R['getters'] {
    return this.content.getters
  }

  get mutations(): R['mutations'] {
    return this.content.mutations
  }

  get actions(): R['actions'] {
    return this.content.actions
  }

  get rawModule(): VuexModule<inferState<R['state']>, any> {
    const { _mutations, content, options } = this
    const { state: _state } = content

    const state = Object.assign({}, mutable(_state))
    console.log('TCL: state', state)

    const mutations = _mutations

    const { namespaced } = options

    return {
      state,
      mutations,
      namespaced,
    }
  }
}
