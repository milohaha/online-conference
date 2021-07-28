import Api from '../api'
import { USER_REGISTER, USER_SIGNIN } from './types'

export const UserLogin = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    Api.localLogin(data).then(function (response) {
      if (response.data.message === 'WRONG_USERNAME_OR_PASSWORD') {
        resolve(response)
      } else if (response.data.message === 'USER_LOGIN') {
        commit(USER_SIGNIN, response.data.expireTime)
        window.location = '/team'
      }
    })
      .catch(function (error) {
        reject(error)
      })
  })
}
export const UserRegister = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    Api.localRegister(data).then(function (response) {
      if (response.data.message === 'ALREADY_REGISTERED') {
        resolve(response)
      } else if (response.data.message === 'USER_REGISTER') {
        commit(USER_REGISTER, response.data.expireTime)
        resolve(response)
      }
    })
  })
}
