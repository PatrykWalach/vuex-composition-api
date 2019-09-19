import CompositionApi, { inferState } from '../../src'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('Module', () => {
  it('can be subscribed to', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      setup({ mutation, state }) {
        const data = state({})

        const CHANGE_DATA = mutation(
          'CHANGE_DATA',
          { data },
          (
            state: inferState<{
              data: typeof data
            }>,
            value: { y: string },
          ) => {
            state.data = value
          },
        )

        return {
          state: {
            data,
          },
          mutations: {
            CHANGE_DATA,
          },
        }
      },
    })

    let called = 0
    const test = { y: '1' }

    Main.subscribe(({ type, payload }) => {
      called += 1
      expect(type).toStrictEqual('CHANGE_DATA')
      expect(payload).toStrictEqual(test)
    })

    Main.mutations.CHANGE_DATA(test)
    expect(called).toStrictEqual(1)
  })
})
