import { Reactive } from './apis/state'

export const createStore = <R extends Reactive<any, any>>(states: R) => {
  //devtools
  return states
}
