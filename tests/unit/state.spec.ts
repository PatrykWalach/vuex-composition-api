import { concatState, state } from '../../src'
import CompositionApi from '@vue/composition-api'

import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('state()', () => {
  it('is mutable', () => {
    const store = state(
      { x: 0 },
      {
        INCREMENT_X: state => ({
          x: state.x + 1,
        }),
      },
    )

    store.commit.INCREMENT_X(undefined)

    expect(store.state.x).toStrictEqual(1)
  })

  it('deep is mutable', () => {
    const store = state(
      { x: 0 },
      {
        x: { INCREMENT: state => state + 1 },
      },
    )

    store.commit.x.INCREMENT(undefined)

    expect(store.state.x).toStrictEqual(1)
  })
})

describe('concatState()', () => {
  it('concats state', () => {
    const x = state(
      { value: 0 },
      {
        INCREMENT: ({ value }) => ({ value: value + 1 }),
      },
    )

    const y = state(0, {
      INCREMENT: state => ++state,
    })

    const store = concatState({ x, y })
    store.commit.x.INCREMENT(undefined)
    expect(store.state.x.value).toStrictEqual(1)
    expect(store.state.y).toStrictEqual(0)
  })

  it('syncs state', () => {
    const x = state(0, {
      INCREMENT: value => value + 1,
    })

    const store = concatState({ x })
    expect(store.state.x).toStrictEqual(x.state)
  })
  it('syncs state', () => {
    const x = state(
      { value: 0 },
      {
        value: { INCREMENT: value => value + 1 },
      },
    )

    const store = concatState({ x })
    store.commit.x.value.INCREMENT(undefined)
    expect(store.state.x.value).toStrictEqual(x.state.value)
  })
})
