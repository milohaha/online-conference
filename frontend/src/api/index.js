import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

const instance = axios.create()
if (localStorage.getItem('token')) {
  instance.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token').replace(/(^")|("$)/g, '')
}

export default {
  login: function (data) {
    return Vue.axios.post(process.env.VUE_APP_API_BASE + '/login', data)
  },
  register: function (data) {
    return Vue.axios.post(process.env.VUE_APP_API_BASE + '/register', data)
  },
  createTeam: function (data) {
    return instance.post(process.env.VUE_APP_API_BASE + '/team/createteam', data)
  },
  joinTeam: function (data) {
    return instance.post(process.env.VUE_APP_API_BASE + '/team/checkTeam', data)
  }
}
