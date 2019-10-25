import { RawModule } from './module'
import { Store } from 'vuex'
import { assert } from './utils'
import { mutable } from './apis/mutation'

const registerModules = (store: Store<any>, modules: RawModule[]) =>
  modules.forEach(
    ({ _name, name, state, rawModule, registerStore, _mutations, modules }) => {
      assert(
        !!_name.length,
        'provide names for all root modules used inside the plugin',
      )

      store.registerModule(_name, rawModule)

      store.subscribe(({ type, payload }) => {
        const splitName = type.split('/')

        const mutationName = splitName.pop()

        if (mutationName && splitName.join('/') === name.join('/')) {
          if (_mutations.hasOwnProperty(mutationName)) {
            _mutations[mutationName](mutable(state), payload)
          }
        }
      })

      registerStore(({ type, payload }) => {
        store.commit(type, payload)
      })

      if (Object.values(modules).length) {
        registerModules(store, Object.values(modules))
      }
    },
  )

export const plugin = (modules: RawModule[]) => (store: Store<any>) =>
  registerModules(store, modules)
