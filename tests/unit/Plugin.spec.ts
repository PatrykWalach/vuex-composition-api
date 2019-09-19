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

  it('commits mutations inside Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      setup({ state, mutation }) {
        const data = state(0)

        return {
          mutations: {
            BUMP_DATA: mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            }),
          },
          state: {
            data,
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

  it('commits namespaced mutations inside Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state(0)

        return {
          mutations: {
            BUMP_DATA: mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            }),
          },
          state: {
            data,
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

  it('commits mutations from Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      setup({ state, mutation }) {
        const data = state(0)

        return {
          mutations: {
            BUMP_DATA: mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            }),
          },
          state: {
            data,
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    store.commit('BUMP_DATA')

    expect(Main.state.data.value).toStrictEqual(1)
    expect(store.state.main.data).toStrictEqual(1)
  })

  it('commits namespaced mutations from Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state(0)

        return {
          mutations: {
            BUMP_DATA: mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            }),
          },
          state: {
            data,
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
  it('dispatches actions from Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      setup({ state, mutation }) {
        const data = state(0)
        const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
          state.data += 1
        })
        return {
          actions: {
            bumpDataBy(n: number) {
              Array(n).forEach(BUMP_DATA)
            },
          },
          mutations: {
            BUMP_DATA,
          },
          state: {
            data,
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    const test = 6
    store.dispatch('bumpDataBy', test)

    expect(Main.state.data.value).toStrictEqual(test)
    expect(store.state.main.data).toStrictEqual(test)
  })

  it('dispatches namespaced actions from Vuex', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state(0)

        const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
          state.data += 1
        })

        return {
          actions: {
            bumpDataBy(n: number) {
              Array(n).forEach(BUMP_DATA)
            },
          },
          mutations: {
            BUMP_DATA,
          },
          state: {
            data,
          },
        }
      },
    })

    const store = new CompositionApi.Store({
      plugins: [CompositionApi.Plugin([Main])],
    })

    const test = 6
    store.dispatch('bumpDataBy', test)

    expect(Main.state.data.value).toStrictEqual(test)
    expect(store.state.main.data).toStrictEqual(test)
  })
})
