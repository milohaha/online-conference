import api from '../api'
import { USER_SIGNIN } from './types'

export const UserLogin = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    api.localLogin(data).then(function (response) {
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
