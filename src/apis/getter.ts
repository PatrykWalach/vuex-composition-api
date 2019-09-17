import { Ref, computed } from '@vue/composition-api'
import { assert } from '../utils'

export type Getter<T> = Ref<T> & {
  _getter: () => T
}

export const getter = <T>(_getter: () => T): Getter<T> => {
  const value: Ref<T> = computed(_getter)

  return new Proxy(value, {
    get: (obj, prop) => {
      if (prop === '_getter') return _getter

      return obj.value
    },
    set: () => {
      if (process.env.NODE_ENV !== 'production') {
        assert(false, 'assigning to getter is forbidden')
      }
      return true
    },
  }) as Getter<T>
}
