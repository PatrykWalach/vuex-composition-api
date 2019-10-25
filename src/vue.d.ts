import { RawModule } from './module'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $modules: Record<string, RawModule>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    modules?: Record<string, RawModule>
  }
}
