import Vuex, { ActionContext } from 'vuex'
import { action, createModule, mutation, state } from '../../src'
import CompositionApi, { reactive } from '@vue/composition-api'
import { createDirectStore } from 'direct-vuex'
import { createLocalVue } from '@vue/test-utils'
import { ModuleOptions } from '../../src/module'

const localVue = createLocalVue()
localVue.use(CompositionApi)
localVue.use(Vuex)

describe('Module', () => {
  it('returns module options', () => {
    const x = { y: 'z' }
    const test = createModule(
      () => ({ namespaced: true, state: reactive(x) } as const),
    )

    const test2 = createModule(
      () =>
        ({
          modules: {
            test,
          },
          namespaced: true,
        } as const),
    )

    const { store } = createDirectStore({
      modules: { test2 },
    } as const)

    expect(store.state.test2.test).toStrictEqual(x)
  })
})
