import CompositionApi, { createModule } from '../../src'
import { createLocalVue } from '@vue/test-utils'
import { mapActions } from '../../src/module'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('Module', () => {
  it('can be subscribed to', () => {
    const Main = createModule({
      name: 'main',
      setup({ mutation, state }) {
        const data = state({})

        const CHANGE_DATA = mutation(
          'CHANGE_DATA',
          { data },
          (state, value: { y: string }) => {
            state.data = value
          },
        )

        return {
          mutations: {
            CHANGE_DATA,
          },
          state: {
            data,
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

    Main.CHANGE_DATA(test)
    expect(called).toStrictEqual(1)
  })

  it('can take just a setup function', () => {
    const Main = createModule(({ mutation, state }) => {
      const data = state({})

      const CHANGE_DATA = mutation(
        'CHANGE_DATA',
        { data },
        (state, value: { y: string }) => {
          state.data = value
        },
      )

      return {
        mutations: {
          CHANGE_DATA,
        },
        state: {
          data,
        },
      }
    })

    let called = 0
    const test = { y: '1' }

    Main.subscribe(({ type, payload }) => {
      called += 1
      expect(type).toStrictEqual('CHANGE_DATA')
      expect(payload).toStrictEqual(test)
    })

    Main.CHANGE_DATA(test)
    expect(called).toStrictEqual(1)
  })
})

// describe('mapState', () => {})
// describe('mapGetters', () => {})
describe('mapActions', () => {
  const action = (n: number) => n ** 2

  const mapped = mapActions({ action })
  expect(mapped.action({}, 2)).toStrictEqual(4)
})
