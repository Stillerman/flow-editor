import Vue from 'vue'
import App from './App.vue'
import VueDragResize from 'vue-drag-resize'
import * as VueWindow from '@hscmap/vue-window'
import * as VueMenu from '@hscmap/vue-menu'

Vue.use(VueMenu)
Vue.use(VueWindow)

Vue.component('vue-drag-resize', VueDragResize)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
