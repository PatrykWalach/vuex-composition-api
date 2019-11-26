import { concatState, state } from '../../src'
import CompositionApi from '@vue/composition-api'

import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)
describe('concatState()', () => {
  it('concats state', () => {
    const x = state(
      { value: 0 },
      {
        INCREMENT: state => ({ value: state.value.value + 1 }),
      },
    )

    const y = state(0, {
      INCREMENT: state => state.value + 1,
    })

    const store = concatState({ x, y })
    store.commit.x.INCREMENT(undefined)
    expect(store.state.x.value).toStrictEqual(1)
    expect(store.state.y).toStrictEqual(0)
  })

  it('syncs simple state mutations', () => {
    const x = state(0, {
      INCREMENT: state => state.value + 1,
    })

    const store = concatState({ x })
    store.commit.x.INCREMENT(undefined)
    expect(x.state).toStrictEqual(store.state.x)
    x.commit.INCREMENT(undefined)
    expect(store.state.x).toStrictEqual(x.state)
  })

  it('syncs complex state mutations', () => {
    const x = state(
      { value: 0 },
      {
        INCREMENT: state => ({ value: state.value.value + 1 }),
      },
    )

    const store = concatState({ x })
    store.commit.x.INCREMENT(undefined)
    expect(x.state.value).toStrictEqual(store.state.x.value)
    x.commit.INCREMENT(undefined)
    expect(store.state.x.value).toStrictEqual(x.state.value)
  })

  it('syncs complex state part mutations', () => {
    const x = state(
      { value: 0 },
      {
        value: { INCREMENT: state => state.value + 1 },
      },
    )

    const store = concatState({ x })
    store.commit.x.value.INCREMENT(undefined)
    expect(x.state.value).toStrictEqual(store.state.x.value)
    x.commit.value.INCREMENT(undefined)
    expect(store.state.x.value).toStrictEqual(x.state.value)
  })
})
