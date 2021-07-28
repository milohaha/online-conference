import { USER_SIGNIN } from '../types'

const isLoginIn = function () {
  const token = localStorage.getItem('userToken')
  if (token) {
    if (token > Date.now()) {
      return localStorage.getItem('userToken')
    }
  } else {
    return false
  }
}

const state = {
  token: isLoginIn() || false
}

const mutations = {
  [USER_SIGNIN] (stateLocal, userToken) {
    localStorage.setItem('userToken', userToken)
    stateLocal.token = userToken
  }
}

export default {
  state,
  mutations
}
