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
import { assert } from './utils'

export type SetupReturnType = {
  state?: Record<string, State<any>>
  getters?: Record<string, Getter<any>>
  mutations?: Record<string, VuexMutation<any>>
  actions?: Record<string, (payload: any) => any>
  modules?: Record<
    string,
    Pick<ModuleOptions<any>, 'setup' | 'namespaced'> | Setup<any>
  >
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

export type ModuleOptions<R> = {
  setup: Setup<R>
  name?: string | string[]
  namespaced?: boolean
  parent?: RawModule
}

export type inferModules<R> = {
  [K in keyof R]: R[K] extends ModuleOptions<infer O> | Setup<infer O>
    ? Module<O>
    : any
}

export class RawModule<R extends SetupReturnType = any> {
  private _modules: inferModules<R['modules']>
  private _options: { namespaced?: boolean } = {}
  private _parent: RawModule<any> | null
  private _setup: Omit<R, 'modules'>
  _mutations: Record<string, (state: inferState<any>, payload: any) => any> = {}
  _name: string[]
  _store: Subscriber | null = null
  _subscribers: Subscriber[] = []

  constructor(options: ModuleOptions<R> | Setup<R>) {
    const { name = [], namespaced = false, parent = null } =
      options instanceof Function ? {} : options

    assert(!namespaced || !!name, 'provide name for namespaced modules')

    this._options = { namespaced }

    this._name = [
      ...((parent && parent._name) || []),
      ...(typeof name === 'string' ? [name] : name),
    ]

    this._parent = parent

    const module = this

    const mutation: BoundMutation = <
      S extends Record<string, State<any>>,
      O = void
    >(
      name: string,
      state: S,
      fn: (state: inferState<S>, payload?: O) => void,
    ): ((payload?: O) => void) =>
       _mutation(module, name, state, fn)


    const { modules, ...content } = (options instanceof Function
      ? options
      : options.setup)({
      getter,
      mutation,
      state,
    })

    const _modules = (Object.fromEntries(
      Object.entries(modules || {}).map(([key, options]) => {
        if (options instanceof Function) {
          return [
            key,
            createModule({ name: key, parent: this, setup: options }),
          ]
        }

        return [key, createModule({ ...options, name: key, parent: this })]
      }),
    ) as unknown) as inferModules<R['modules']>

    this._setup = content
    this._modules = _modules
  }

  get name(): string[] {
    const { _name, _options, _parent } = this

    return [
      ...((_parent && _parent.name) || []),
      ...(_options.namespaced ? _name.slice().splice(-1) : []),
    ]
  }

  get subscribe() {
    return (subscriber: Subscriber) => this._subscribers.push(subscriber)
  }

  get registerStore() {
    return (store: Subscriber) => {
      this._store = store
    }
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

  get modules(): inferModules<R['modules']> {
    return this._modules
  }

  get rawModule(): VuexModule<inferState<R['state']>, any> {
    const {
      getters: _getters,
      _mutations,
      actions: _actions,
      _setup,
      _options,
    } = this

    const { state: _state } = _setup

    const state = _state && mapState(_state as NonNullable<R['state']>)

    const getters =
      _getters && mapGetters(_getters as NonNullable<R['getters']>)

    const mutations = _mutations

    const actions =
      _actions && mapActions(_actions as NonNullable<R['actions']>)

    const { namespaced } = _options

    return {
      actions,
      getters,
      mutations,
      namespaced,
      state,
    }
  }
}

export type Module<R extends SetupReturnType> = R['state'] &
  R['getters'] &
  R['mutations'] &
  R['actions'] &
  inferModules<R['modules']> &
  RawModule<R>

export const createModule = <R extends SetupReturnType>(
  moduleOptions: ModuleOptions<R> | Setup<R>,
) => {
  const module = new RawModule(moduleOptions)

  return new Proxy(
    {
      ...module.state,
      ...module.getters,
      ...module.mutations,
      ...module.actions,
      ...module.modules,
      ...module,
    },
    {
      get: (object, key: keyof typeof module) => {
        if (object.hasOwnProperty(key)) {
          return object[key]
        }
        return module[key]
      },
    },
  )
}

export const mapState = <S extends Record<string, State<any>>>(
  state: S,
): inferState<S> => Object.assign({}, mutable(state))

export const mapGetters = <G extends Record<string, Getter<any>>>(
  getters: G,
): {
  [K in keyof G]: () => G[K]
} =>
  Object.fromEntries(
    Object.entries(getters).map(([key, getter]) => [key, getter._getter]),
  ) as {
    [K in keyof G]: () => G[K]
  }

export const mapActions = <A extends Record<string, (payload: any) => any>>(
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
