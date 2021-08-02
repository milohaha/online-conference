import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import Login from './modules/login'
import Team from './modules/team'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  modules: {
    Login,
    Team
  },
  strict: debug
})
