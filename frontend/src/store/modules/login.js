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
const state = {
  isUserLogin: isLoginIn(),
  userID: parseInt(localStorage.getItem('userID'))
}

const mutations = {
  [USER_SIGNIN] (stateLocal, userInfo) {
    localStorage.setItem('expireTime', userInfo.expireTime)
    localStorage.setItem('token', userInfo.token)
    localStorage.setItem('userID', userInfo.userID)
    stateLocal.isLogin = true
    stateLocal.userID = Number(userInfo.userID)
  },
  [USER_LOGOUT] (stateLocal) {
    localStorage.removeItem('expireTime')
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    localStorage.removeItem('teamID')
    localStorage.removeItem('conferenceID')
    stateLocal.isLogin = false
    stateLocal.userID = 0
  }
}

export default {
  state,
  mutations
}
