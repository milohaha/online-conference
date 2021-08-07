import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './store/index.js'
import socketio from 'socket.io-client'
import Constants from './constants'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import './assets/icon/iconfont.css' // Vuesax styles
Vue.use(Vuesax, {})
Vue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })
Vue.prototype.$constant = Constants
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
