import VuexCompositionApi, { useStore } from '../../src'
import Vuex from 'vuex'
import { createDirectStore } from 'direct-vuex'
import { createLocalVue } from '@vue/test-utils'

describe('install()', () => {
  it('can be installed', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const { store } = createDirectStore({} as const)

    expect(() => {
      localVue.use(VuexCompositionApi, store.original)
    }).not.toThrow()
  })
})

describe('useStore()', () => {
  it('returns store', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const { store } = createDirectStore({} as const)
    localVue.use(VuexCompositionApi, store.original)

    new localVue({
      setup() {
        const injectedStore = useStore()
        expect(injectedStore).toStrictEqual(store.original)
        return { injectedStore }
      },
    })
  })
})
