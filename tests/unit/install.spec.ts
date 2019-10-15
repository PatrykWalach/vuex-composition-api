import CompositionApi, { Module, Store } from '../../src'
import Vue from 'vue'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('CompositionApi.install()', () => {
  // it('injects modules', () => {
  //   const modules = {
  //     a: new Module({
  //       name: 'a',
  //       setup() {
  //         return {}
  //       },
  //     }),
  //   }

  //   expect(
  //     new Vue({
  //       modules,
  //     }),
  //   ).not.toThrow()
  // })

  it('injects store', () => {
    const store = new Store({})

    expect(
      () =>
        new Vue({
          store,
        }),
    ).not.toThrow()
  })
})
