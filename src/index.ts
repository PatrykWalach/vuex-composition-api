import { install } from './install'

export * from './apis/getter'
export * from './apis/state'
export * from './apis/mutation'
export { Module } from './module'
export { Store } from 'vuex'
export { plugin } from './plugin'

const VuexCompositionApi = { install }
export default VuexCompositionApi
