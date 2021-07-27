import api from '../api'
import { USER_SIGNIN } from './types'

export const UserLogin = ({ commit }, data) => {
  api.localLogin(data).then(function (response) {
    if (response.data.type === 'USER_NOTFOUND') {

    } else if (response.data.type === 'WRONG_PASSWORD') {

    } else if (response.data.type === 'USER_LOGININ') {
      commit(USER_SIGNIN, response.data.token)
      window.location = '/team'
    }
  })
    .catch(function (error) {
      console.log(error)
    })
}
