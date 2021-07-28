import { USER_REGISTER, USER_SIGNIN } from '../types'

const isLoginIn = function () {
  const token = localStorage.getItem('userToken')
  if (token) {
    if (token > Date.now()) {
      return true
    }
  } else {
    return false
  }
}

const state = {
  token: isLoginIn()
}

const mutations = {
  [USER_SIGNIN] (stateLocal, userToken) {
    localStorage.setItem('userToken', userToken)
    stateLocal.token = userToken
  },
  [USER_REGISTER] (stateLocal, userToken) {
    localStorage.setItem('userToken', userToken)
    stateLocal.token = userToken
  }
}

export default {
  state,
  mutations
}
