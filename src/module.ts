// import 'core-js/features/object/from-entries'
import { ActionTree, Getter, MutationTree } from 'vuex'

import { State } from './apis/state'

export type ModuleOptions<S = any> = {
  state?: State<S>
  namespaced?: boolean
  getters?: Record<string, Getter<S, any>>
  mutations?: MutationTree<S>
  actions?: ActionTree<S, any>
  modules?: Record<string, ModuleOptions>
}

export type Setup<R extends ModuleOptions> = (this: void) => R

export const createModule = <R extends ModuleOptions = any>(
  options: Setup<R>,
): R => options()

// export const mapGetters = <G extends Record<string, Getter<any>>>(
//   getters: G,
// ): {
//   [K in keyof G]: () => G[K]
// } =>
//   Object.fromEntries(
//     Object.entries(getters).map(([key, getter]) => [key, () => getter.value]),
//   ) as {
//     [K in keyof G]: () => G[K]
//   }
