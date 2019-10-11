import CompositionApi, { mutable, mutation, state } from '../../src'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('mutable()', () => {
  it('makes state mutable', () => {
    const x = state('')

    const test = 'null'
    mutable({ x }).x = test

    expect(x.value).toStrictEqual(test)
  })
})

describe('mutation()', () => {
  it('can be used outside the module', () => {
    const Main = new CompositionApi.Module({
      name: 'main',
      setup({ state }) {
        const data = state({})
        return {
          state: {
            data,
          },
        }
      },
    })

    const test = { y: '1' }

    const CHANGE_DATA = mutation(Main, 'CHANGE_DATA', Main.state, state => {
      state.data = test
    })

    CHANGE_DATA()

    expect(Main.state.data.value).toStrictEqual(test)
  })
})
