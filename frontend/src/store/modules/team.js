import { ENTER_TEAM } from '../types'

const state = {
  teamID: parseInt(localStorage.getItem('teamID'))
}

const mutations = {
  [ENTER_TEAM] (stateLocal, teamID) {
    localStorage.setItem('teamID', teamID)
    stateLocal.teamID = parseInt(teamID)
  }
}

export default {
  state,
  mutations
}
