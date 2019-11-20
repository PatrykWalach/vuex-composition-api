import { State } from './state'

export type Mutation = {
  <S extends Record<string, State<any>>>(
    state: S,
    fn: (state: S, payload: void) => any,
  ): (state: S, payload: void) => any

  <S extends Record<string, State<any>>, O>(
    state: S,
    fn: (state: S, payload: O) => any,
  ): (state: S, payload: O) => any
}

export const mutation: Mutation = <S extends State<any>, O>(
  state: S,
  fn: (state: S, payload?: O) => any,
) => fn
