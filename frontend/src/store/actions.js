import Api from '../api'
import { USER_LOGOUT, USER_SIGNIN, CREATE_TEAM } from './types'

export const userLogin = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    Api.localLogin(data).then(function (response) {
      if (response.data.message === 'WRONG_USERNAME_OR_PASSWORD') {
        resolve(response)
      } else if (response.data.message === 'USER_LOGIN') {
        commit(USER_SIGNIN, {
          expireTime: response.data.expireTime,
          token: response.data.token
        })
        window.location = '/team'
      }
    })
      .catch(function (error) {
        reject(error)
      })
  })
}
export const userRegister = ({ commit }, data) => {
  return new Promise((resolve) => {
    Api.localRegister(data).then(function (response) {
      resolve(response)
    })
  })
}
export const userLogout = ({ commit }) => {
  commit(USER_LOGOUT)
  window.location = '/'
}

export const createTeam = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    Api.createTeam(data).then(function (response) {
      if (response.data.type === 'SUCCESS') {
        commit(CREATE_TEAM, response.data.teamManage)
        resolve(response)
      } else if (response.data.type === 'Failure') {
        resolve(response)
      }
    })
  })
}
