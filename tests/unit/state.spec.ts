import CompositionApi, { state } from '../../src'
import { createLocalVue } from '@vue/test-utils'
import { isRef } from '@vue/composition-api'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('state()', () => {
  it('can be accessed by calling .value', () => {
    const test = { y: 'z' }
    const x = state(test)
    expect(x.value).toStrictEqual(test)
  })

  it('isRef', () => {
    const x = state(null)
    expect(isRef(x)).toStrictEqual(true)
  })

  it('can not be set', () => {
    const x = state('')
    expect(() => {
      x.value = 'null'
    }).toThrow()
  })

  it('can be replaced getter', () => {
    const x = state('')
    const test = 'null'

    x._replace(test)
    expect(x.value).toStrictEqual(test)
  })
})
