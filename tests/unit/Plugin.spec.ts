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

  it('dispatches mutations inside Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state([])

        return {
          state: {
            data,
          },
          mutations: {
            PUSH_DATA: mutation(
              'PUSH_DATA',
              { data },
              (state, payload: string) => {
                state.data.push(payload)
              },
            ),
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    Main.mutations.PUSH_DATA('test')

    expect(Main.state.data.value.length).toStrictEqual(1)
    expect(store.state.main.data.length).toStrictEqual(1)
  })

  it('dispatches mutations from Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state([])

        return {
          state: {
            data,
          },
          mutations: {
            PUSH_DATA: mutation(
              'PUSH_DATA',
              { data },
              (state, payload: string) => {
                state.data.push(payload)
              },
            ),
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    store.commit('main/PUSH_DATA', 'test')

    expect(Main.state.data.value.length).toStrictEqual(1)
    expect(store.state.main.data.length).toStrictEqual(1)
  })
})
