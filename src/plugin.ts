import { Module } from './module'
import { Store } from 'vuex'
import { assert } from './utils'
import { mutable } from './apis/mutation'

export const plugin = (modules: Module[]) => (store: Store<any>) =>
  modules.forEach(
    ({ name, state, rawModule, registerStore, _mutations, options }) => {
      assert(
        name !== null,
        'provide names for all modules used inside the plugin',
      )

      store.registerModule(name || '', rawModule)

      store.subscribe(({ type, payload }) => {
        let mutationName = ''
        if (options.namespaced) {
          const splitName = type.split('/')

          if (splitName.length === 2) {
            const [moduleName, _mutationName] = splitName
            if (moduleName === name) {
              mutationName = _mutationName
            }
          }
        } else {
          mutationName = type
        }
        if (mutationName && _mutations.hasOwnProperty(mutationName)) {
          _mutations[mutationName](mutable(state), payload)
        }
      })

      registerStore(({ type, payload }) => {
        store.commit(type, payload)
      })
    },
  )
