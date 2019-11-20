import { UnwrapRef } from '@vue/composition-api/dist/reactivity'
export type State<T> = UnwrapRef<T>
export { reactive as state } from '@vue/composition-api'
