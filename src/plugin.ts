import { Module } from './module'
import { Store } from 'vuex'

export const Plugin = (modules: Module<any>[]) => (store: Store<any>) =>
  modules.forEach(({ name, rawModule, subscribe }) => {
    store.registerModule(name, rawModule)

    subscribe((mutationName, state, payload) => {
      store.commit(mutationName, payload)
    })
  })
