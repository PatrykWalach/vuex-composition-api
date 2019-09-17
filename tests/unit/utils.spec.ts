import { assert } from '../../src/utils'

describe('assert()', () => {
  it('throws if codition is false', () => {
    expect(() => {
      assert(false, '')
    }).toThrow()
  })

  it('does not throw if codition is true', () => {
    expect(() => {
      assert(true, '')
    }).not.toThrow()
  })
})
