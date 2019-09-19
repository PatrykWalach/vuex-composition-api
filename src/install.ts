import CompositionApi from '@vue/composition-api'
import Vue from 'vue'
import { install as installVuex } from 'vuex'

export const install = (_Vue: typeof Vue) => {
  CompositionApi.install(_Vue)
  installVuex(_Vue)
}
