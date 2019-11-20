import CompositionApi, { reactive } from '@vue/composition-api'
import { createModule, mutation } from '../../src'
import Vuex from 'vuex'
import { createDirectStore } from 'direct-vuex'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)
localVue.use(Vuex)

describe('state()', () => {
  it('provides typing without payload', () => {
    const test = createModule(() => {
      const state = reactive({ x: 0 })
      return {
        mutations: {
          TEST_MUTATION: mutation(state, () => {}),
        },
      } as const
    })

    const { store } = createDirectStore({
      modules: { test },
    } as const)

    expect(store.commit.TEST_MUTATION).not.toThrow()
  })

  it('provides typing for state', () => {
    const test = createModule(() => {
      const state = reactive({ x: 0 })
      return {
        mutations: {
          TEST_MUTATION: mutation(state, state => {
            state.x = 2
          }),
        },
      } as const
    })

    const { store } = createDirectStore({
      modules: { test },
    } as const)

    expect(store.commit.TEST_MUTATION).not.toThrow()
  })

  it('provides typing with payload', () => {
    const test = createModule(() => {
      const state = reactive({ x: 0 })

      return {
        mutations: {
          TEST_MUTATION: mutation(state, (state, payload: number) => {
            state.x += payload
          }),
        },
      } as const
    })

    const { store } = createDirectStore({
      modules: { test },
    } as const)

    expect(() => store.commit.TEST_MUTATION(2)).not.toThrow()
  })
})
