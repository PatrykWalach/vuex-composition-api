import { action, createModule, mutation } from '../../src'
import CompositionApi, { reactive } from '@vue/composition-api'
import Vuex, { ActionContext } from 'vuex'
import { createDirectStore } from 'direct-vuex'
import { createLocalVue } from '@vue/test-utils'
const localVue = createLocalVue()
localVue.use(CompositionApi)
localVue.use(Vuex)

describe('action()', () => {
  it('provides typing with payload', () => {
    const test = createModule(
      () =>
        ({
          actions: {
            testAction: action((_, payload: number) => ++payload),
          },
        } as const),
    )

    const { store } = createDirectStore({
      modules: { test },
    } as const)

    expect(() => store.dispatch.testAction(2)).not.toThrow()
  })

  it('dispatches once', () => {
    const test = createModule(() => {
      const state = reactive({ x: 0 })

      const CHANGE_X = mutation(state, state => {
        state.x++
      })

      return {
        actions: {
          testAction: action(_ => {
            const { commit } = testContext(_)
            commit.CHANGE_X()
          }),
        },
        mutations: {
          CHANGE_X,
        },
        state,
      } as const
    })

    const testContext = (
      context: ActionContext<typeof test.state, typeof store.state>,
    ) => moduleActionContext(context, test)

    const { store, moduleActionContext } = createDirectStore({
      modules: { test },
    } as const)

    store.dispatch.testAction()

    expect(store.state.test.x).toStrictEqual(1)
  })
})
