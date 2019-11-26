import 'core-js/features/object/from-entries'
import { MapRawMutations, RawMutations } from './mutation'
import { Ref, computed, ref } from '@vue/composition-api'
import { assert, travel } from '../utils'

export class Reactive<T, M extends RawMutations<T> = RawMutations<T>> {
  public _state: Ref<T>
  public _mutations: M
  public commit: MapRawMutations<M>

  constructor(value: T, mutations: M) {
    this._state = ref(value)
    this._mutations = mutations

    const mapMutation = <S = any, P = any>(
      mutations: RawMutations<S>,
      keys: string[] = [],
    ): MapRawMutations<M> =>
      Object.fromEntries(
        Object.entries(mutations).map(([type, mutation]) => {
          if (mutation instanceof Function) {
            return [
              type,
              (payload: P) => {
                const mutationKeys = keys.slice()
                mutationKeys.unshift('value')
                const [key] = mutationKeys.splice(-1)

                const mutable = travel(this._state, mutationKeys)

                let set = false
                const proxy = computed({
                  get: () => mutable[key],
                  set: v => {
                    set = true
                    mutable[key] = v
                  },
                })
                const value = mutation(proxy, payload)

                if (value !== undefined) {
                  assert(!set, `if you mutate state remove return statement`)

                  mutable[key] = value
                } else {
                  mutable[key] = proxy.value
                }
              },
            ]
          }
          return [type, mapMutation(mutation, [...keys, type])]
        }),
      )

    this.commit = mapMutation(this._mutations)
  }

  get state(): Readonly<T> {
    return this._state.value
  }

  set state(v) {
    assert(
      process.env.NODE_ENV === 'production',
      `use store.replaceState() to explicit replace store state.`,
    )
  }
}

export const state = <T, M extends RawMutations<T>>(state: T, mutations: M) =>
  new Reactive(state, mutations)
