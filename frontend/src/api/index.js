import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

const instance = axios.create()
if (localStorage.getItem('username')) {
  instance.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('username').replace(/(^")|("$)/g, '')
}

export default {
  localLogin: function (data) {
    return Vue.axios.post('', data)
  }
}
