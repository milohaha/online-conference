import { ENTER_TEAM } from '../types'

const state = {
  teamID: parseInt(localStorage.teamID)
}

const mutations = {
  [ENTER_TEAM] (stateLocal, value) {
    stateLocal.teamID = value
    localStorage.setItem('teamID', value)
  }
}

export default {
  state,
  mutations
}
