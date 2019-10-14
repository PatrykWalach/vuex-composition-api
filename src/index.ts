export * from './apis/getter'
export * from './apis/state'
export * from './apis/mutation'

export { Module } from './module'
export { Store } from 'vuex'
import { install } from './install'
export { plugin } from './plugin'

const VuexCompositionApi = { install }
export default VuexCompositionApi
