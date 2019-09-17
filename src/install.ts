import { install as installVuex } from 'vuex'
import CompositionApi from '@vue/composition-api'
import Vue from 'vue'

export const install = (_Vue: typeof Vue) => {
  CompositionApi.install(_Vue)
  installVuex(_Vue)
}
