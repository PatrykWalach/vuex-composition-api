import VuexCompositionApi, { createStore, state, useStore } from '../../src'
import CompositionApi from '@vue/composition-api'

import { createLocalVue } from '@vue/test-utils'

describe('install()', () => {
  it('can be installed', () => {
    const localVue = createLocalVue()

    localVue.use(CompositionApi)
    const store = createStore(state({}, {}))

    expect(() => {
      localVue.use(VuexCompositionApi, store)
    }).not.toThrow()
  })
})

// describe('useStore()', () => {
//   it('returns store', () => {
//     const localVue = createLocalVue()

//     localVue.use(CompositionApi)
//     const store = createStore(state({}, {}))

//     localVue.use(VuexCompositionApi, store)

//     new localVue({
//       setup() {
//         const injectedStore = useStore()
//         expect(injectedStore).toStrictEqual(store)
//         return { injectedStore }
//       },
//     })
//   })
// })
