export * from './apis/getter'
export * from './apis/state'

import { Store } from 'vuex'
import { Module } from './module'
import { install } from './install'
import { Plugin } from './plugin'

const VuexCompositionModules = { install, Store, Module, Plugin }
export default VuexCompositionModules
