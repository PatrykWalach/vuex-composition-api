import { InjectionKey, inject, provide } from '@vue/composition-api'
import { Store } from 'vuex'
import Vue from 'vue'

const key: InjectionKey<Store<any>> = Symbol('store')
export const useStore = () => inject(key) as Store<any>

export const install = (app: typeof Vue, store: Store<any>) =>
  app.mixin({
    setup() {
      provide(key, store)
      return {}
    },
  })
