import { InjectionKey, inject, provide } from '@vue/composition-api'

import Vue from 'vue'
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface Hook {}
const key: InjectionKey<Hook> = Symbol('store')

export const useStore = () => inject(key) as Hook

export const install = (app: typeof Vue, store: Hook) =>
  app.mixin({
    setup() {
      provide(key, store)
      return {}
    },
  })
