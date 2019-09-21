import 'core-js/features/object/from-entries'
import {
  BoundMutation,
  mutation as _mutation,
  inferState,
  mutable,
} from './apis/mutation'
import { Getter, getter } from './apis/getter'
import { State, state } from './apis/state'
import { Module as VuexModule, Mutation as VuexMutation } from 'vuex'

export type SetupReturnType = {
  state?: Record<string, State<any>>
  getters?: Record<string, Getter<any>>
  mutations?: Record<string, VuexMutation<any>>
  actions?: Record<string, (payload: any) => any>
}
export type SetupContext = {
  mutation: BoundMutation
  state: <T>(value: T) => State<T>
  getter: <T>(value: () => T) => Getter<T>
}

export type Setup<R extends SetupReturnType> = (options: SetupContext) => R

export type Subscriber = <S extends Record<string, State<any>>, P>(
  fn: { type: string; payload: P },
  state: S,
) => any

export class Module<R extends SetupReturnType> {
  name: string
  private _setup: R
  options: { namespaced?: boolean } = {}
  _subscribers: Subscriber[] = []
  _store: Subscriber | null = null
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

    const mutation: BoundMutation = <
      S extends Record<string, State<any>>,
      O = void
    >(
      name: string,
      state: S,
      fn: (state: inferState<S>, payload?: O) => void,
    ): ((payload?: O) => void) => {
      return _mutation(module, name, state, fn)
    }

    const { subscribe: _subscribe, registerStore: _registerStore } = this

    this.subscribe = function boundSubscribe(subscription) {
      return _subscribe.call(module, subscription)
    }

    this.registerStore = function boundRegisterStore(subscription) {
      return _registerStore.call(module, subscription)
    }

    this._setup = setup({ getter, mutation, state })
  }

  subscribe(subscriber: Subscriber) {
    this._subscribers.push(subscriber)
  }

  registerStore(store: Subscriber) {
    this._store = store
  }

  get state(): R['state'] {
    return this._setup.state
  }

  get getters(): R['getters'] {
    return this._setup.getters
  }

  get mutations(): R['mutations'] {
    return this._setup.mutations
  }

  get actions(): R['actions'] {
    return this._setup.actions
  }

  get rawModule(): VuexModule<inferState<R['state']>, any> {
    const {
      getters: _getters,
      _mutations,
      actions: _actions,
      _setup,
      options,
    } = this
    const { state: _state } = _setup

    const state = _state && mapState(_state)

    const getters =
      _getters && mapGetters(_getters as NonNullable<R['getters']>)

    const mutations = _mutations

    const actions =
      _actions && mapActions(_actions as NonNullable<R['actions']>)

    const { namespaced } = options

    return {
      actions,
      getters,
      mutations,
      namespaced,
      state,
    }
  }
}

export const mapState = <S extends Record<string, State<any>>>(
  state: S,
): inferState<S> => Object.assign({}, mutable(state))

export const mapGetters = <G extends NonNullable<SetupReturnType['getters']>>(
  getters: G,
): {
  [K in keyof G]: () => G[K]
} =>
  Object.fromEntries(
    Object.entries(getters).map(([key, getter]) => [key, getter._getter]),
  ) as {
    [K in keyof G]: () => G[K]
  }

export const mapActions = <A extends NonNullable<SetupReturnType['actions']>>(
  actions: A,
): {
  [K in keyof A]: (
    context: any,
    payload: Parameters<A[K]>[0],
  ) => ReturnType<A[K]>
} =>
  Object.fromEntries(
    Object.entries(actions).map(
      <P, R>([key, action]: [string, (payload: P) => R]) => [
        key,
        (context: any, payload: P) => action(payload),
      ],
    ),
  ) as {
    [K in keyof A]: (
      context: any,
      payload: Parameters<A[K]>[0],
    ) => ReturnType<A[K]>
  }
