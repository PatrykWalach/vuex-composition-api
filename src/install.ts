import CompositionApi from '@vue/composition-api'
import Vue from 'vue'
import { install as installVuex } from 'vuex'

export const install = (_Vue: typeof Vue) => {
  CompositionApi.install(_Vue)
  installVuex(_Vue)

  Vue.mixin({
    beforeCreate: function() {
      const options = this.$options
      if (options.modules) {
        this.$modules = options.modules
      } else if (options.parent && options.parent.$modules) {
        this.$modules = options.parent.$modules
      }
    },
  })
}
