import { install as installVuex } from 'vuex'
import CompositionApi from '@vue/composition-api'
import Vue, { VueConstructor } from 'vue'

export const install = (Vue: VueConstructor<Vue>) => {  
  CompositionApi.install(Vue)
  installVuex(Vue)
}