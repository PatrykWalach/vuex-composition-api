import { Ref, ref } from '@vue/composition-api'
import { assert } from '../utils'


export const isState = <T>(value: State<T> | any | Ref<T>): value is State<T> =>
  value.replace instanceof Function

export type State<T> = Ref<T> & { replace(value: T): void }

export const state = <T>(value: T): State<T> => {
  const _value: Ref<T> = ref(value)

  return new Proxy(_value, {
    get: (obj, prop) => {
      if (prop === 'replace')
        return (newValue: T) => {
          _value.value = newValue
        }
      return obj.value
    },
    set: (obj, prop, v) => {
      if (process.env.NODE_ENV !== 'production') {
        assert(false, `use state.replace() to explicit replace state.`)
      }
      return true
    },
  }) as State<T>
}
