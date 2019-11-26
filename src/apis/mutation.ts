import { Ref } from '@vue/composition-api'

type RawMutation<S, P = any> = (state: Ref<S>, payload: P) => S | void

export type RawMutations<S> = NonNullable<
  | Exclude<
      {
        [K in keyof Partial<S>]: RawMutations<S[K]>
      },
      S
    >
  | Record<string, RawMutation<S>>
>

type Mutation<P = any> = (payload: P) => void

export type MapRawMutations<R> = {
  [K in keyof R]: R[K] extends RawMutation<any, infer P>
    ? Mutation<P>
    : MapRawMutations<R[K]>
}
