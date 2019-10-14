import { Module } from './module'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $modules: Record<string, Module>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    modules?: Record<string, Module>
  }
}
