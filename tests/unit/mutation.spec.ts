import CompositionApi, { state, mutable } from '../../src'

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
