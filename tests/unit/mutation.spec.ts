import CompositionApi, { state } from '../../src'

import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('mutation()', () => {
  new CompositionApi.Module({
    name: '',
    setup({ mutation }) {
      it('makes state mutable', () => {
        const x = state('')
        const CHANGE_X = mutation('CHANGE_X', { x }, (state, newX: string) => {
          state.x = newX
        })

        const test = 'null'
        CHANGE_X(test)

        expect(x.value).toStrictEqual(test)
      })

      return {}
    },
  })
})
