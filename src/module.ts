import { state, State } from './apis/state'
import { getter, Getter } from './apis/getter'
import {
  inferState,
  mutable,
  mutation as _mutation,
  BoundMutation,
} from './apis/mutation'

import {
  Module as VuexModule,
  Mutation as VuexMutation,
  ActionTree,
  ActionContext,
  GetterTree,
} from 'vuex'

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
  _store: Subscriber
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

    const mutation: BoundMutation = (...args: Parameters<BoundMutation>) => {
      return _mutation(module, ...args)
    }

    const { subscribe: _subscribe, registerStore: _registerStore } = this

    this.subscribe = function boundSubscribe(subscription) {
      return _subscribe.call(module, subscription)
    }

    this.registerStore = function boundRegisterStore(subscription) {
      return _registerStore.call(module, subscription)
    }

    this._setup = setup({ mutation, state, getter })
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

    const getters = mapGetters(_getters)

    const mutations = _mutations

    const actions = mapActions(_actions)

    const { namespaced } = options

    return {
      state,
      getters,
      mutations,
      actions,
      namespaced,
    }
  }
}

const mapState = <S extends Record<string, State<any>>>(
  state: S,
): inferState<S> => Object.assign({}, mutable(state))

const mapGetters = (
  getters: SetupReturnType['getters'],
): GetterTree<any, any> =>
  (getters &&
    Object.fromEntries(
      Object.entries(getters).map(([key, getter]) => [key, getter._getter]),
    )) as GetterTree<any, any>

const mapActions = <S, R>(
  actions: SetupReturnType['actions'],
): ActionTree<S, R> =>
  (actions &&
    Object.fromEntries(
      Object.entries(actions).map(
        <P, R>([key, action]: [string, (payload: P) => R]) => [
          key,
          (context: ActionContext<S, R>, payload: P) => action(payload),
        ],
      ),
    )) as ActionTree<S, R>
