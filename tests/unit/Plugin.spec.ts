import CompositionApi, { Module, Store, plugin } from '../../src'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

localVue.use(CompositionApi)

describe('CompositionApi.plugin', () => {
  it('registers modules', () => {
    const test = 'null'
    const Main = new Module({
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
    const store = new Store({
      plugins: [plugin([Main])],
    })

    expect(store.state.main.data).toStrictEqual(test)
  })

  it('commits mutations inside Vuex', () => {
    const Main = new Module({
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

    const store = new Store({
      plugins: [plugin([Main])],
    })

    Main.mutations.BUMP_DATA()

    expect(Main.state.data.value).toStrictEqual(1)
    expect(store.state.main.data).toStrictEqual(1)
  })

  it('commits namespaced mutations inside Vuex', () => {
    const Main = new Module({
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

    const store = new Store({
      plugins: [plugin([Main])],
    })

    Main.mutations.BUMP_DATA()

    expect(Main.state.data.value).toStrictEqual(1)
    expect(store.state.main.data).toStrictEqual(1)
  })

  it('commits mutations from Vuex', () => {
    const Main = new Module({
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

    const store = new Store({
      plugins: [plugin([Main])],
    })

    store.commit('BUMP_DATA')

    expect(Main.state.data.value).toStrictEqual(1)
    expect(store.state.main.data).toStrictEqual(1)
  })

  it('commits namespaced mutations from Vuex', () => {
    const Main = new Module({
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

    const store = new Store({
      plugins: [plugin([Main])],
    })

    store.commit('main/BUMP_DATA')

    expect(Main.state.data.value).toStrictEqual(1)
    expect(store.state.main.data).toStrictEqual(1)
  })

  it('dispatches actions from Vuex', () => {
    const Main = new Module({
      name: 'main',
      setup({ state, mutation }) {
        const data = state(0)

        const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
          state.data += 1
        })

        return {
          actions: {
            bumpDataBy: (n: number) => {
              for (let i = 0; i < n; i++) {
                BUMP_DATA()
              }
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

    const store = new Store({
      plugins: [plugin([Main])],
    })

    const test = 6
    store.dispatch('bumpDataBy', test)

    expect(Main.state.data.value).toStrictEqual(test)
    expect(store.state.main.data).toStrictEqual(test)
  })

  it('dispatches namespaced actions from Vuex', () => {
    const Main = new Module({
      name: 'main',
      namespaced: true,
      setup({ state, mutation }) {
        const data = state(0)

        const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
          state.data += 1
        })

        return {
          actions: {
            bumpDataBy: (n: number) => {
              for (let i = 0; i < n; i++) {
                BUMP_DATA()
              }
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

    const store = new Store({
      plugins: [plugin([Main])],
    })

    const test = 6
    store.dispatch('main/bumpDataBy', test)

    expect(Main.state.data.value).toStrictEqual(test)
    expect(store.state.main.data).toStrictEqual(test)
  })

  it(`dispatches namespaced module's submodule actions from  from Vuex`, () => {
    const Main = new Module({
      name: 'main',
      namespaced: true,
      setup: () => ({
        modules: {
          sub: ({ state, mutation }) => {
            const data = state(0)

            const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            })

            return {
              actions: {
                bumpDataBy: (n: number) => {
                  for (let i = 0; i < n; i++) {
                    BUMP_DATA()
                  }
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
        },
      }),
    })

    const store = new Store({
      plugins: [plugin([Main])],
    })

    const test = 6
    store.dispatch('main/bumpDataBy', test)

    expect(Main.modules.sub.state.data.value).toStrictEqual(test)

    expect(store.state.main.sub.data).toStrictEqual(test)
  })

  it(`dispatches namespaced module's namespaced submodule actions from  from Vuex`, () => {
    const Main = new Module({
      name: 'main',
      namespaced: true,
      setup: () => ({
        modules: {
          sub: {
            namespaced: true,
            setup({ state, mutation }) {
              const data = state(0)

              const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
                state.data += 1
              })

              return {
                actions: {
                  bumpDataBy: (n: number) => {
                    for (let i = 0; i < n; i++) {
                      BUMP_DATA()
                    }
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
          },
        },
      }),
    })

    const store = new Store({
      plugins: [plugin([Main])],
    })

    const test = 6
    store.dispatch('main/sub/bumpDataBy', test)

    expect(Main.modules.sub.state.data.value).toStrictEqual(test)

    expect(store.state.main.sub.data).toStrictEqual(test)
  })

  it(`dispatches module's submodule actions from  from Vuex`, () => {
    const Main = new Module({
      name: 'main',
      setup: () => ({
        modules: {
          sub: ({ state, mutation }) => {
            const data = state(0)

            const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
              state.data += 1
            })

            return {
              actions: {
                bumpDataBy: (n: number) => {
                  for (let i = 0; i < n; i++) {
                    BUMP_DATA()
                  }
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
        },
      }),
    })

    const store = new Store({
      plugins: [plugin([Main])],
    })

    const test = 6
    store.dispatch('bumpDataBy', test)

    expect(Main.modules.sub.state.data.value).toStrictEqual(test)

    expect(store.state.main.sub.data).toStrictEqual(test)
  })

  it(`dispatches module's namespaced submodule actions from  from Vuex`, () => {
    const Main = new Module({
      name: 'main',
      setup: () => ({
        modules: {
          sub: {
            namespaced: true,
            setup({ state, mutation }) {
              const data = state(0)

              const BUMP_DATA = mutation('BUMP_DATA', { data }, state => {
                state.data += 1
              })

              return {
                actions: {
                  bumpDataBy: (n: number) => {
                    for (let i = 0; i < n; i++) {
                      BUMP_DATA()
                    }
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
          },
        },
      }),
    })

    const store = new Store({
      plugins: [plugin([Main])],
    })

    const test = 6
    store.dispatch('sub/bumpDataBy', test)

    expect(Main.modules.sub.state.data.value).toStrictEqual(test)

    expect(store.state.main.sub.data).toStrictEqual(test)
  })
})
