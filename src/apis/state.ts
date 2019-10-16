import { Ref, ref } from '@vue/composition-api'
import { assert } from '../utils'

export type State<T> = Ref<T> & { _replace(value: T): void }

export const state = <T>(value: T): State<T> => {
  const _value: Ref<T> = ref(value)

  return new Proxy(_value, {
    get: (obj, prop) => {
      if (prop === '_replace') {
        return (newValue: T) => {
          _value.value = newValue
        }
      }

      assert(
        prop === 'value',
        `prop ${String(prop)} doesn't exist on type State`,
      )

      return obj.value
    },
    set: () => {
      if (process.env.NODE_ENV !== 'production') {
        assert(false, 'use state._replace() to explicit replace state.')
      }
      return true
    },
  }) as State<T>
}
