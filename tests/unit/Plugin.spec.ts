import CompositionApi from '../../src'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

localVue.use(CompositionApi)

describe('CompositionApi.Plugin', () => {
  it('registers modules', () => {
    const test = 'null'
    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state }) {
        return {
          state: {
            data: state(test),
          },
        }
      },
    })
    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    expect(store.state.main.data).toStrictEqual(test)
  })

  it('keeps Vuex in sync with the modules', () => {
    const test = 'null'

    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state('')
        return {
          state: {
            data,
          },
          mutations: {
            CHANGE_DATA: mutation(
              'CHANGE_DATA',
              { data },
              (state, payload: string) => {
                state.data = payload
              },
            ),
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    Main.mutations.CHANGE_DATA(test)

    expect(store.state.main.data).toStrictEqual(test)
  })
})
