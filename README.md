# Vuex Composition Modules

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/PatrykWalach/vuex-composition-api.svg?branch=master)](https://travis-ci.org/PatrykWalach/vuex-composition-api)
[![codecov](https://codecov.io/gh/PatrykWalach/vuex-composition-api/branch/master/graph/badge.svg)](https://codecov.io/gh/PatrykWalach/vuex-composition-api)

## Features
 - Type safety,
 - State tracking inside vue-devtools,
 - Modules namespacing and nesting.

## Install

```sh
npm i vuex-composition-api
```

## About

This module tries to mimic [@vue/composition-api](https://github.com/vuejs/composition-api) syntax inside [Vuex](https://github.com/vuejs/vuex) modules.

## API

### `CompositionApi`

It installs Vuex as well as Composition API.

```typescript
import CompositionApi from 'vuex-composition-modules'
import Vue from 'vue'
Vue.use(CompositionApi)
```

It allows modules to be injected into Vue instance.

```typescript
const modules = { Main: new Module(
  ...
) }

new Vue({
  modules,
  render: h => h(App),
}).$mount('#app')
```

Declaration file can be used for type safety.

```typescript
import { Module } from 'vuex-composition-api'
import Vue from 'vue'
import { modules } from '@/store'

declare module 'vue/types/vue' {
  interface Vue {
    $modules: typeof modules
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    modules?: Record<string, Module>
  }
}
```

### `Module`

Every module requires a setup function.

```typescript
const a = new Module({
  setup() {
    return {}
  },
})

const b = new Module(() => ({}))
```

Setup can return state, getters, mutations, actions, and modules.

```typescript
new Module(() => ({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
}))
```

Setup function provides state, getter and mutation.

```typescript
new Module(({ state, getter, mutation }) => {})
```

Setup results can be accessed directly.

```typescript
const module = new Module(({ state }) => ({
  state: {
    x: state(null),
  },
}))

module.state.x.value // expected result: null
```

Modules can be nested.

```typescript
const main = new Module(({ state }) => ({
  state: {
    x: state(2),
  },
  modules: {
    sub: ({ state, getter }) => {
      const y = state(3)
      const getXY = getter(() => x.value * y.value)

      return {
        state: {
          y,
        },
        getters: {
          getXY,
        },
      }
    },
  },
}))

main.modules.sub.getters.getXY // expected result: 6
```

Every module can be subscribed to.

```typescript
const Main = new Module(({ state, mutation }) => {
  const data = state([''])

  const CHANGE_DATA = mutation(
    'CHANGE_DATA',
    { data },
    (state, payload) => (state.data = payload),
  )

  return {
    state: {
      data,
    },
    mutations: {
      CHANGE_DATA,
    },
  }
})

Main.subscribe(({ type, payload }, state) => {
  console.log(type) // expected output: 'CHANGE_DATA'
  console.log(payload) // expected output: ['null']
  console.log(state) // expected output: { data: { value: ['null'] }}
})

Main.mutations.CHANGE_DATA(['null'])
```

### `plugin`

The plugin receives an array of `Modules` as an argument.
Creating `Store` and using the plugin is optional, the modules can be used independently, however calling it allows for tracking state, getters and commits with [vue-devtools](https://github.com/vuejs/vue-devtools)

```typescript
const x = new Module(options)
const y = new Module(options)

new Store({
  plugins: [plugin([x, y])],
})
```

### `Store`

Using it only during development is recommended since Vuex doesn't provide type safety and takes up additional memory.

```typescript
const store =
  process.env.NODE_ENV === 'production'
    ? undefined
    : new Store({ plugins: [plugin([x, y])] })
```

### `state()`

Can be accessed by calling `.value`.

```typescript
const x = state(null)
x.value // expected output: null
```

Can't be set directly.

```typescript
const x = state(null)
x.value = '' // will throw an Error
```

Can be set using `._replace()`.

Although it is not recommended, because it won't change state inside Vuex.

```typescript
const x = state(null)
x._replace('')
x.value // expected output: ''
```

### `getter()`

Can be accessed by calling `.value`.

```typescript
const x = state(null)
const y = getter(() => x.value)
y.value // expected output: null
```

Can't be set

```typescript
const x = state(null)
const y = getter(() => x.value)
y.value = '' // will throw an Error
```

The original function can be accessed by `._getter`.

```typescript
const x = state(null)
const y = getter(() => x.value)
y._getter // expected output: () => x.value
```

### `mutation()`

Is bound to the given module.

It takes object of `States` and retrieves a writable version of it inside a callback.

```typescript
const x = state(null)
const CHANGE_X = mutation('CHANGE_X', { x }, (state, newX) => (state.x = newX))
CHANGE_X('')
x.value // expected output: ''
```

Please don't deconstruct the state or it will lose its reactivity!

```typescript
const x = state(null)
const CHANGE_X = mutation('CHANGE_X', { x }, ({ x }, newX) => (x = newX))
CHANGE_X('')
x.value // expected output: null
```

## Usage

This files will be used for both of the examples.

`@/store/index.ts`

```typescript
import Vue from 'vue'

import CompositionApi, { State } from '@/vuex-composition-api'

Vue.use(CompositionApi)

export const Main = new Module({
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

const store =
  process.env.NODE_ENV === 'production'
    ? undefined
    : new Store({
        plugins: [plugin([Main])],
      })

export default store
```

`@/main.ts`

```typescript
...
import store from '@/store'

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
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
```

### 1#

This method is not recommended if you plan to unit test your components.

`@/App.vue`

```html
...
<script lang="ts">
  import { Main } from '@/store'

  export default createComponent({
    name: 'app',
    setup() {
      const { getters, mutations, actions } = Main

      return { ...getters, ...mutations, ...actions }
    },
    components: {
      HelloWorld,
    },
  })
</script>
```

### 2#

`@/store/index.ts`

```typescript
...
export const modules = { Main }
```

`@/main.ts`

```typescript
...
import { modules } from '@/store'

new Vue({
  ...
  modules,
}).$mount('#app')
```

`@/vue.d.ts`

```typescript
import { Module } from 'vuex-composition-api/dist/module'
import Vue from 'vue'
import { modules } from '@/store'

declare module 'vue/types/vue' {
  interface Vue {
    $modules: typeof modules
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    modules?: Record<string, Module>
  }
}
```

`@/App.vue`

```html
...
<script lang="ts">
  export default createComponent({
    setup(_, { root }) {
      const { getters, mutations, actions } = root.$modules.Main

      return { ...getters, ...mutations, ...actions }
    },
  })
</script>
```
