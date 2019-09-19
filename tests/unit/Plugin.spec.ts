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
        const data = state(0)

        return {
          state: {
            data,
          },
          mutations: {
            BUMP_DATA: mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            }),
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    Main.mutations.BUMP_DATA()

    expect(Main.state.data.value).toStrictEqual(1)
    expect(store.state.main.data).toStrictEqual(1)
  })

  it('dispatches mutations from Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state(0)

        return {
          state: {
            data,
          },
          mutations: {
            BUMP_DATA: mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            }),
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    store.commit('main/BUMP_DATA')

    expect(Main.state.data.value).toStrictEqual(1)
    expect(store.state.main.data).toStrictEqual(1)
  })
})
