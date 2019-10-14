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

export type StateTree = Record<string, State<any>>

export type GetterTree = Record<string, Getter<any>>

export type MutationTree = Record<string, VuexMutation<any>>

export type ActionTree = Record<string, (payload: any) => any>

export type SetupContext = {
  mutation: BoundMutation
  state: <T>(value: T) => State<T>
  getter: <T>(value: () => T) => Getter<T>
}

export type Setup<
  S extends StateTree,
  G extends GetterTree,
  M extends MutationTree,
  A extends ActionTree
> = (
  options: SetupContext,
) => {
  state: S
  getters: G
  mutations: M
  actions: A
}

export type Subscriber = <S extends Record<string, State<any>>, P>(
  fn: { type: string; payload: P },
  state: S,
) => any

export class Module<
  S extends StateTree = any,
  G extends GetterTree = any,
  M extends MutationTree = any,
  A extends ActionTree = any
> {
  name: string
  private _setup: {
    state: S
    getters: G
    mutations: M
    actions: A
  }
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
    setup: Setup<S, G, M, A>
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

    this._setup = setup({ getter, mutation, state })
  }

  get subscribe() {
    return (subscriber: Subscriber) => this._subscribers.push(subscriber)
  }

  get registerStore() {
    return (store: Subscriber) => {
      this._store = store
    }
  }

  get state(): S {
    return this._setup.state
  }

  get getters(): G {
    return this._setup.getters
  }

  get mutations(): M {
    return this._setup.mutations
  }

  get actions(): A {
    return this._setup.actions
  }

  get rawModule(): VuexModule<inferState<S>, any> {
    const {
      getters: _getters,
      _mutations,
      actions: _actions,
      _setup,
      options,
    } = this

    const { state: _state } = _setup

    const state = _state && mapState(_state as NonNullable<S>)

    const getters = _getters && mapGetters(_getters as NonNullable<G>)

    const mutations = _mutations

    const actions = _actions && mapActions(_actions as NonNullable<A>)

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

export const mapState = <S extends NonNullable<StateTree>>(
  state: S,
): inferState<S> => Object.assign({}, mutable(state))

export const mapGetters = <G extends NonNullable<GetterTree>>(
  getters: G,
): {
  [K in keyof G]: () => G[K]
} =>
  Object.fromEntries(
    Object.entries(getters).map(([key, getter]) => [key, getter._getter]),
  ) as {
    [K in keyof G]: () => G[K]
  }

export const mapActions = <A extends NonNullable<ActionTree>>(
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
