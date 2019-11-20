export * from './apis/getter'
export * from './apis/state'
export * from './apis/mutation'
export * from './apis/action'
export { useStore } from './install'
import { install } from './install'
export { createModule } from './module'
const VuexCompositionApi = { install }
export default VuexCompositionApi
