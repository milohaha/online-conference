import { USER_LOGOUT, USER_SIGNIN } from '../types'

const isLoginIn = function () {
  const expireTime = localStorage.getItem('expireTime')
  if (expireTime) {
    if (Number(expireTime) > Date.now()) {
      return true
    }
  }
  return false
}
const getUserID = function () {
  const userID = localStorage.getItem('userID')
  return parseInt(userID)
}
const state = {
  isLogin: isLoginIn(),
  userID: getUserID()
}

const mutations = {
  [USER_SIGNIN] (stateLocal, userInfo) {
    localStorage.setItem('expireTime', userInfo.expireTime)
    localStorage.setItem('token', userInfo.token)
    localStorage.setItem('userID', userInfo.userID)
    stateLocal.isLogin = true
    stateLocal.userID = parseInt(userInfo.userID)
  },
  [USER_LOGOUT] (stateLocal) {
    localStorage.removeItem('expireTime')
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    stateLocal.isLogin = false
    stateLocal.userID = 0
  }
}

export default {
  state,
  mutations
}
