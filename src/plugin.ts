import { Module } from './module'
import { Store } from 'vuex'
import { mutable } from './apis/mutation'

export const Plugin = (modules: Module<any>[]) => (store: Store<any>) =>
  modules.forEach(
    ({ name, state, rawModule, subscribe, _mutations, options }) => {
      store.registerModule(name, rawModule)

      store.subscribe(({ type, payload }) => {
        let mutationName: string
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
        if (_mutations.hasOwnProperty(mutationName)) {
          _mutations[mutationName](mutable(state), payload)
        }
      })

      subscribe(({ type, payload }) => {
        store.commit(type, payload)
      })
    },
  )
