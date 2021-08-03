import Api from '../api'
import { USER_LOGOUT, USER_SIGNIN } from './types'

export const userLogin = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    Api.login(data).then(function (response) {
      if (response.data.message === 'WRONG_USERNAME_OR_PASSWORD') {
        resolve(response)
      } else if (response.data.message === 'USER_LOGIN') {
        commit(USER_SIGNIN, {
          expireTime: response.data.expireTime,
          token: response.data.token,
          userID: response.data.userID
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
    Api.register(data).then(function (response) {
      resolve(response)
    })
  })
}
export const userLogout = ({ commit }) => {
  commit(USER_LOGOUT)
  window.location = '/'
}
export const createTeam = ({ commit }, data) => {
  return new Promise((resolve) => {
    Api.createTeam(data).then(function (response) {
      resolve(response)
    })
  })
}
export const joinTeam = ({ commit }, data) => {
  return new Promise((resolve) => {
    Api.joinTeam(data).then(function (response) {
      resolve(response)
    })
  })
}
export const getMembers = ({ commit }, data) => {
  return new Promise((resolve) => {
    Api.getMembers(data).then(function (response) {
      resolve(response)
    })
  })
}
export const getObjects = ({ commit }, data) => {
  return new Promise((resolve) => {
    Api.getObjects(data).then(function (response) {
      resolve(response)
    })
  })
}
export const getMessages = ({ commit }, data) => {
  return new Promise((resolve) => {
    Api.getMessages(data).then(function (response) {
      resolve(response)
    })
  })
}
export const inviteConferenceMember = ({ commit }, data) => {
  return new Promise((resolve) => {
    Api.createConference(data).then(function (response) {
      resolve(response)
    })
  })
}
