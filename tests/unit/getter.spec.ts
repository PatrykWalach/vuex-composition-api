import CompositionApi, { isRef } from '@vue/composition-api'
import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import { getter } from '../../src'

const localVue = createLocalVue()
localVue.use(CompositionApi)
localVue.use(Vuex)

describe('getter()', () => {
  it('can be accessed by calling .value', () => {
    const test = {
      y: 'z',
    }
    const x = getter(() => test)
    expect(x.value).toStrictEqual(test)
  })

  it('isRef', () => {
    const x = getter(() => null)
    expect(isRef(x)).toStrictEqual(true)
  })
})
