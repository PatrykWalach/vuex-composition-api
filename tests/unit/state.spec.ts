import { state } from '../../src'
import CompositionApi from '@vue/composition-api'

import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('simple state()', () => {
  it('is mutable', () => {
    const store = state(0, {
      INCREMENT: state => state.value + 1,
    })

    store.commit.INCREMENT(undefined)

    expect(store.state).toStrictEqual(1)
  })

  it('is mutable directly', () => {
    const store = state(0, {
      INCREMENT: state => {
        state.value++
      },
    })

    store.commit.INCREMENT(undefined)

    expect(store.state).toStrictEqual(1)
  })

  it('can be mutated in only one way', () => {
    const store = state(0, {
      INCREMENT: state => {
        state.value++
        return state.value
      },
    })

    expect(() => store.commit.INCREMENT(undefined)).toThrow()
  })
})
describe('complex state()', () => {
  it('is mutable', () => {
    const store = state(
      { x: 0 },
      {
        INCREMENT: state => ({ x: state.value.x + 1 }),
      },
    )

    store.commit.INCREMENT(undefined)

    expect(store.state.x).toStrictEqual(1)
  })

  it('is mutable directly', () => {
    const store = state(
      { x: 0 },
      {
        INCREMENT: state => {
          state.value.x++
        },
      },
    )

    store.commit.INCREMENT(undefined)

    expect(store.state.x).toStrictEqual(1)
  })

  it('can be mutated in only one way', () => {
    const store = state(
      { x: 0 },
      {
        INCREMENT: state => {
          state.value.x++
          return state.value
        },
      },
    )

    expect(() => store.commit.INCREMENT(undefined)).toThrow()
  })
})

describe('complex state() part', () => {
  it('is mutable', () => {
    const store = state(
      { x: 0 },
      {
        x: { INCREMENT: state => state.value + 1 },
      },
    )

    store.commit.x.INCREMENT(undefined)

    expect(store.state.x).toStrictEqual(1)
  })

  it('is mutable directly', () => {
    const store = state(
      { x: 0 },
      {
        x: { INCREMENT: state => state.value + 1 },
      },
    )

    store.commit.x.INCREMENT(undefined)

    expect(store.state.x).toStrictEqual(1)
  })

  it('can be mutated in only one way', () => {
    const store = state(
      { x: 0 },
      {
        x: {
          INCREMENT: state => {
            state.value++
            return state.value
          },
        },
      },
    )

    expect(() => store.commit.x.INCREMENT(undefined)).toThrow()
  })
})
