import { USER_LOGOUT, USER_SIGNIN } from '../types'

const isLoginIn = function () {
  const expireTime = localStorage.getItem('expireTime')
  if (expireTime) {
    if (expireTime > Date.now()) {
      return true
    }
  }
  return false
}

const state = {
  isLogin: isLoginIn()
}

const mutations = {
  [USER_SIGNIN] (stateLocal, userInfo) {
    localStorage.setItem('expireTime', userInfo.expireTime)
    localStorage.setItem('token', userInfo.token)
    stateLocal.isLogin = true
  },
  [USER_LOGOUT] (stateLocal) {
    localStorage.removeItem('expireTime')
    localStorage.removeItem('token')
    stateLocal.isLogin = false
  }
}

export default {
  state,
  mutations
}
