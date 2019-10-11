export * from './apis/getter'
export * from './apis/state'
export * from './apis/mutation'

import { Module } from './module'
import { Store } from 'vuex'
import { install } from './install'
import { plugin } from './plugin'

const VuexCompositionApi = { Module, Store, install, plugin }
export default VuexCompositionApi
