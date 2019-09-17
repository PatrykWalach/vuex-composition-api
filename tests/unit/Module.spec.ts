import CompositionApi, { State } from '../../src'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('Module', () => {
  const Main = new CompositionApi.Module({
    name: 'main',
    setup({ mutation, state, getter }) {
      const data: State<string[]> = state([])

      const dataLength = getter(() => data.value.length)

      const DATA_PUSH = mutation(
        'DATA_PUSH',
        { data },
        (state, value: string[]) => {
          state.data.push(...value)
        },
      )

      const pushAndLogData = (_data: string[]) => {
        console.log()
        DATA_PUSH(_data)
      }

      return {
        state: {
          data,
        },
        getters: {
          dataLength,
        },
        mutations: {
          DATA_PUSH,
        },
        actions: {
          pushAndLogData,
        },
      }
    },
  })

  it('can be subscribed to', () => {
    let called = 0
    const test = ['null']
    Main.subscribe((name, state, payload) => {
      called += 1
      expect(name).toStrictEqual('DATA_PUSH')
      expect(payload).toStrictEqual(test)
    })
    Main.mutations.DATA_PUSH(test)
    expect(called).toStrictEqual(1)
  })

  it('mutates state', () => {
    const test = ['null']

    const length = Main.state.data.value.length
    Main.mutations.DATA_PUSH(test)
    expect(Main.state.data.value.length).toStrictEqual(length + test.length)
  })
})
