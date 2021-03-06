# Vuex Composition Modules

[![Build Status](https://travis-ci.org/PatrykWalach/vuex-composition-api.svg?branch=master)](https://travis-ci.org/PatrykWalach/vuex-composition-api) [![downloads](https://img.shields.io/npm/dm/vuex-composition-api)](https://www.npmjs.com/package/vuex-composition-api) [![codecov](https://codecov.io/gh/PatrykWalach/vuex-composition-api/branch/master/graph/badge.svg)](https://codecov.io/gh/PatrykWalach/vuex-composition-api) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This project allows for experimental use of [Vuex 5](https://github.com/vuejs/vuex) composition API in [Vue 3](https://github.com/vuejs/vue-next) .

## Table of Contents

- [Getting started](#getting-started)
  - [Composing](#composing)
  - [Plugins](#plugins)
- [API](#api)

## Getting started

1.  Install vuex

    ```tsx
    import { createApp } from 'vue'
    import { createVuex } from 'vuex-composition-api'
    const vuex = createVuex()

    const app = createApp(App).use(vuex)
    // ...
    ```

2.  Define store/stores

    ```tsx
    import { defineStore } from 'vuex-composition-api'
    export const counterStore = defineStore('counter', () => {
      const value = ref(0)

      function increment() {
        value.value++
      }

      return { value, increment }
    })
    ```

3.  Use store

    ```html
    <template>
      <h1>Counter value: {{counter.value}}</h1>
      <button @click="counter.increment">INCREMENT</button>
    </template>

    <script lang="ts">
      import { definecComponent } from 'vue'
      import { useStore } from 'vuex-composition-api'
      import { counterStore } from './counter'

      export default definecComponent({
        setup() {
          const counter = useStore(counterStore)

          return {
            counter,
          }
        },
      })
    </script>
    ```

### Composing

```tsx
import { defineStore } from 'vuex-composition-api'
import { authStore } from './auth'

export const user = defineStore('user', ({ use }) => {
  const auth = use(authStore)

  function login(login, password) {
    auth.user(login, password)
  }

  return { login }
})
```

### Plugins

1. Create plugin

   ```tsx
   function axiosPlugin(provide) {
     provide('axios', axios)
   }
   ```

2. Install plugin

   ```tsx
   import { createApp } from 'vue'
   import { createVuex } from 'vuex-composition-api'

   const vuex = createVuex({ plugins: [axiosPlugin] })

   const app = createApp(App).use(vuex)
   //...
   ```

3. Use plugin

   ```tsx
   import { defineStore } from 'vuex-composition-api'

   export const authStore = defineStore('auth', ({ axios }) => {
     function user(login, password) {
       axios.post('/login', {
         login,
         password,
       })
     }

     return { login }
   })
   ```

### API

## defineStore

```tsx
function defineStore(name: string, setup: StoreSetup): Store
```

## createVuex

```tsx
interface Vuex {
  install(app: App): App
  store(store: Store): T
}

function createVuex(options: { plugins: Plugin[] }): Vuex
```

## useStore

```tsx
function useStore(storeOptions: Store): T
```
