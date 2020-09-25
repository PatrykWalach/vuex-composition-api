import { createVuex, defineStore, useStore } from '../../src'
import { h, ref, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

describe('vuex', () => {
  const counterOptions = defineStore('counter', () => {
    const value = ref(0)

    function increment() {
      value.value++
    }

    return {
      value,
      increment,
    }
  })

  it('works composition', async () => {
    // const counterOptions = defineStore({
    //   state: () => ({ value: 0 }),

    //   getters: {
    //     isIncremented() {
    //       return this.state > 0
    //     },
    //   },

    //   actions: {
    //     increment() {
    //       this.value++
    //     },
    //   },
    // })

    const vuex = createVuex()

    const wrapper = mount(
      defineComponent({
        render() {
          return [
            h('button', { onClick: this.counter.increment }),
            h('div', this.counter.value),
          ]
        },
        setup() {
          const counter = useStore(counterOptions)
          return { counter }
        },
        // use: () => ({
        //   counter: counterOptions,
        // }),
      }),
      { global: { plugins: [vuex] } },
    )

    expect(wrapper.find('div').text()).toStrictEqual('0')

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('div').text()).toStrictEqual('1')
  })
  it('works setup nested', async () => {
    const rootCounterOptions = defineStore('rootCounter', ({ use }) => {
      const counter = use(counterOptions)

      function incrementTwice() {
        counter.increment()
        counter.increment()
      }

      return {
        incrementTwice,
      }
    })

    const vuex = createVuex()

    const wrapper = mount(
      defineComponent({
        render() {
          return [
            h('button', { onClick: this.rootCounter.incrementTwice }),
            h('div', this.counter.value),
          ]
        },
        setup() {
          const counter = useStore(counterOptions)
          const rootCounter = useStore(rootCounterOptions)
          return { counter, rootCounter }
        },
      }),
      { global: { plugins: [vuex] } },
    )

    expect(wrapper.find('div').text()).toStrictEqual('0')

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('div').text()).toStrictEqual('2')
  })
  it('works plugin', async () => {
    const withPluginOptions = defineStore('withPlugin', ({ fn }) => {
      function callFn(payload: unknown) {
        fn(payload)
      }

      return {
        callFn,
      }
    })

    const fn = jest.fn()

    const vuex = createVuex({
      plugins: [(provide) => provide('fn', fn)],
    })

    const wrapper = mount(
      defineComponent({
        render() {
          return [h('button', { onClick: this.withPlugin.callFn })]
        },
        setup() {
          const withPlugin = useStore(withPluginOptions)
          return { withPlugin }
        },
      }),
      { global: { plugins: [vuex] } },
    )

    expect(fn).not.toBeCalled()

    await wrapper.find('button').trigger('click')

    expect(fn).toBeCalled()
  })
})
