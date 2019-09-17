export * from './apis/getter'
export * from './apis/state'
export * from './apis/mutation'

import { Store } from 'vuex'
import { Module } from './module'
import { install } from './install'
import { Plugin } from './plugin'

const VuexCompositionApi = { install, Store, Module, Plugin }
export default VuexCompositionApi
