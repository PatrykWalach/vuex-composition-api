import 'core-js/features/object/from-entries'
import { MapRawMutations, RawMutations } from './mutation'
import { Ref, ref } from '@vue/composition-api'
import { travel } from '../utils'

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
        Object.entries(mutations).map(([key, mutation]) => {
          if (mutation instanceof Function) {
            return [
              key,
              (payload: P) => {
                keys.unshift('value')
                const [key] = keys.splice(-1, 1)

                const mutable = travel(this._state, keys)
                // const readable = travel(this.state, keys)
                // if (key) {
                const value = mutation(mutable[key], payload)
                if (value) {
                  mutable[key] = value
                }
                // } else {
                //   this._state.value = mutation(this._state.value, payload)
                // }
              },
            ]
          }
          return [key, mapMutation(mutation, [...keys, key])]
        }),
      )

    this.commit = mapMutation(this._mutations)
  }

  get state(): Readonly<T> {
    return this._state.value
  }

  set state(v) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `use store.replaceState() to explicit replace store state.`,
      )
    }
  }
}

export const state = <T, M extends RawMutations<T>>(state: T, mutations: M) =>
  new Reactive(state, mutations)

export const concatState = <S extends Record<string, Reactive<any, any>>>(
  modules: S,
) => {
  const entries = Object.entries(modules)

  const mappedState = entries.map(([key, module]) => [key, module._state.value])

  const mappedMutations = entries.map(([key, module]) => [
    key,
    module._mutations,
  ])

  const combined = state(
    Object.fromEntries(mappedState),
    Object.fromEntries(mappedMutations),
  )

  return combined as Reactive<
    {
      [K in keyof S]: S[K]['state']
    },
    {
      [K in keyof S]: S[K]['_mutations']
    }
  >
}
