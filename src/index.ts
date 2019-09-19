export * from './apis/getter'
export * from './apis/state'
export * from './apis/mutation'

import { Module } from './module'
import { Plugin } from './plugin'
import { Store } from 'vuex'
import { install } from './install'

const VuexCompositionApi = {
  Module,
  Plugin,
  Store,
  install,
}
export default VuexCompositionApi
