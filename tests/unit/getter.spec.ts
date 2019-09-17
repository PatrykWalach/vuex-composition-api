import CompositionApi, { getter } from '../../src'
import { isRef } from '@vue/composition-api'

import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

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

  it('can not be set', () => {
    const x = getter(() => '')
    expect(() => {
      x.value = 'null'
    }).toThrow()
  })

  it('stores getter', () => {
    const _getter = () => ''
    const x = getter(_getter)
    expect(x._getter).toStrictEqual(_getter)
  })
})
