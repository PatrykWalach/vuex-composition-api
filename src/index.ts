export * from './apis/state'
export * from './apis/concatState'
export * from './apis/mutation'
export { useStore, Hook } from './install'
import { install } from './install'
export { createStore } from './store'
const VuexCompositionApi = { install }
export default VuexCompositionApi
