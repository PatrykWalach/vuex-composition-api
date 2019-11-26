import { Reactive, state } from './state'

export const concatState = <S extends Record<string, Reactive<any, any>>>(
  modules: S,
) => {
  const entries = Object.entries(modules)

  const mappedState = entries.map(([key, module]) => [key, module._state.value])

  const mappedMutations = entries.map(([key, module]) => [
    key,
    module._mutations,
  ])

  const combined = state(
    Object.fromEntries(mappedState),
    Object.fromEntries(mappedMutations),
  )

  return combined as Reactive<
    {
      [K in keyof S]: S[K]['state']
    },
    {
      [K in keyof S]: S[K]['_mutations']
    }
  >
}
