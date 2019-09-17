# Vuex Composition Modules

## About
This module tries to mimic [@vue/composition-api](https://github.com/vuejs/composition-api) inside [Vuex](https://github.com/vuejs/vuex) modules.

## API

### `CompositionModules`
Calling it is optional, it will install Vuex as well as VueCompositionApi, which can be called elsewhere if you choose to do so.

```typescript
import CompositionModules from 'vuex-composition-modules'
import Vue from 'vue'
Vue.use(CompositionModules)
```

### `CompositionModules.Store`
Doesn't differ from normal Vuex store

```typescript
import CompositionModules from 'vuex-composition-modules'
const store = new CompositionModules.Store({})
export default store
```

### `CompositionModules.Module`
Module requires name and a setup function

Setup function has to return state
```typescript
new Module({
    name: 'module',
    setup(){
        
        return {
            state: {}
        }
    }
})
```

Setup function takes state, getter and mutation as parameters
```typescript
new Module({
    name: 'module',
    setup({ state, getter, mutation }){
    }
})
```

State and getter can be imported directly for reusability
import { state, getter } from 'vuex-composition-modules'
```typescript
const useData = () => {
    const data = state(null)
    return {
        data
    }
}
new Module({
    name: 'module',
    setup({ mutation }){
        const { data } = useData()
        return {
            state: {
                data
            }
        }
    }
})
```

Setup results are accessible directly, or inside `._setup`, although `._setup` may become private property in the future

```typescript
const module = new Module({
    name: 'module',
    setup({ state }){
        return {
            state: {
                x: state(null)
            }
        }
    },
    namespaced: true
})

module.state.x.value = null
```

Modules can be namespaced
```typescript
new Module({
    name: 'module',
    setup,
    namespaced: true
})
```

### `CompositionModules.Plugin`
Plugin recives array of `Modules` as argument

```typescript
const x = new Module(options)
const y = new Module(options)

Vuex.Store({
    plugins: [CompositionModules.Plugin([x, y])]
})
```

### `state()`
Can be accessed by calling `.value`

```typescript
const x = state(null)
x.value // expected output: null
```

Can't be set directly

```typescript
const x = state(null)
x.value = ''// will throw an Error
```

Can be set useing `.replace()`

At the moment so it won't change state inside Vuex

```typescript
const x = state(null)
x.replace('')
x.value // expected output: ''
```

### `getter()`
Can be accessed by calling `.value`

At the moment it's not accessible inside Vuex
```typescript
const x = state(null)
const y = getter(() => x.value)
y.value // expected output: null
```

Can't be set
```typescript
const x = state(null)
const y = getter(() => x.value)
y.value = ''// will throw an Error
```

### `mutation()`
Is bound to the given module

It takes object made of `State` and retrives writable verion of it

```typescript
const x = state(null)
const CHANGE_X = mutation('CHANGE_X', { x }, (state, newX) => state.x = newX)
CHANGE_X('')
x.value // expected output: ''
```

Please don't deconstruct the state or it will lose it's reactivity!
```typescript
const x = state(null)
const CHANGE_X = mutation('CHANGE_X', { x }, ({ x }, newX) => x = newX)
CHANGE_X('')
x.value // expected output: null
```

## Example
`@/store/index.ts`
```typescript
import Vue from 'vue'

import VuexCompositionModules, { State } from '@/vuex-composition-api'

Vue.use(VuexCompositionModules)

export const Main = new VuexCompositionModules.Module({
  name: 'main',
  namespaced: true,
  setup({ state, getter, mutation }) {
    const data: State<{ x: string } | null> = state(null)

    const arrayData: State<string[]> = state([])

    const getAllData = getter(() => {
      return {
        data: data.value,
        arrayData: arrayData.value,
      }
    })

    const CHANGE_DATA = mutation(
      'CHANGE_DATA',
      { data },
      (state, value: { x: string } | null) => {
        state.data = value
      },
    )

    CHANGE_DATA({ x: 'das' })

    const PUSH_ARRAY_DATA = mutation(
      'PUSH_ARRAY_DATA',
      { arrayData },
      (state, value: string[]) => {
        state.arrayData.push(...value)
      },
    )

    const logAndPushData = (payload: string[]) => {
      PUSH_ARRAY_DATA(payload)
    }

    return {
      state: {
        data,
        arrayData,
      },
      getters: {
        getAllData,
      },
      mutations: {
        PUSH_ARRAY_DATA,
        CHANGE_DATA,
      },
      actions: {
        logAndPushData,
      },
    }
  },
})

const store = new VuexCompositionModules.Store({
  plugins: [VuexCompositionModules.Plugin([Main])],
})

export default store
```

`@/App.vue`
```html
<template> 
  <div>
      <button @click="CHANGE_DATA({ x: Math.random().toString() })">
        CHANGE_DATA
      </button>
      <button @click="logAndPushData([Math.random().toString()])">
        LOG AND PUSH DATA
      </button>
      {{ getAllData }}
  </div>
</template> 
<script lang="ts">
import { Main } from '@/store'

export default createComponent({
  name: 'app',
  setup() {
    const { getters, mutations, actions } = Main.content

    return { ...getters, ...mutations, ...actions }
  },
  components: {
    HelloWorld,
  },
})
</script>
```