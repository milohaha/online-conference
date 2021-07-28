import { USER_SIGNIN } from '../types'

var isLoginIn = function () {
  var token = localStorage.getItem('username')
  if (token) {
    var payload = JSON.parse(token.split('.')[1])
    if (payload.exp > Date.now() / 1000) {
      return JSON.parse(localStorage.getItem('username'))
    }
  } else {
    return false
  }
}

const state = {
  token: isLoginIn() || null
}

const mutations = {
  [USER_SIGNIN] (stateLocal, username) {
    localStorage.setItem('username', JSON.stringify(username))
    stateLocal.token = username
  }
}

export default {
  state,
  mutations
}
