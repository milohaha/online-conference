import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

const instance = axios.create()
if (localStorage.getItem('userToken')) {
  instance.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('userToken').replace(/(^")|("$)/g, '')
}

export default {
  localLogin: function (data) {
    return Vue.axios.post(process.env.VUE_APP_API_BASE + '/login', data)
  },
  localRegister: function (data) {
    return Vue.axios.post(process.env.VUE_APP_API_BASE + '/register', data)
  }
}
