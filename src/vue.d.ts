import { Module } from './'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $modules: Record<string, Module<any>>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    modules?: Record<string, Module<any>>
  }
}
