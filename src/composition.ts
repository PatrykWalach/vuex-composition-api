import { App, InjectionKey, inject, reactive, UnwrapRef, Ref } from 'vue'

export const VUEX: InjectionKey<Vuex> = Symbol('vuex')

export interface Context {
  use: VuexStore
}

export type StoreSetup<T extends object> = (context: Context) => T

interface Store<T extends object> {
  name: string
  setup: StoreSetup<T>
}

export function defineStore<T extends object>(
  name: string,
  setup: StoreSetup<T>,
): Store<T> {
  return { name, setup }
}

export type VuexStore = <T extends object>(
  options: Store<T>,
) => UnwrapNestedRefs<T>

export class Vuex {
  private _stores = new Map<string, unknown>()
  private _setupContext: Record<string, unknown> = {}

  public install<T extends App>(app: T) {
    app.provide(VUEX, this)
    return app
  }
  public store<T extends object>({
    name,
    setup,
  }: Store<T>): UnwrapNestedRefs<T> {
    const store = this._stores.get(name)
    if (store) {
      return store as UnwrapNestedRefs<T>
    }

    const storeInstance = reactive(
      setup((this._setupContext as unknown) as Context),
    )

    this._stores.set(name, storeInstance)
    return storeInstance
  }

  constructor(plugins: Plugin[]) {
    plugins
      .concat((provide) => provide('use', this.store.bind(this)))
      .forEach((plugin) =>
        plugin((key, value) => {
          this._setupContext[key] = value
        }),
      )
  }
}

export type Plugin = (provide: <T>(key: string, value: T) => void) => any

export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>

export const createVuex = (
  { plugins }: { plugins: Plugin[] } = { plugins: [] },
): Vuex => new Vuex(plugins)

export const useStore = <T extends object>(storeOptions: Store<T>) => {
  const vuex = inject(VUEX)
  if (!vuex) {
    throw new Error('no vuex provided')
  }
  return vuex.store(storeOptions)
}
