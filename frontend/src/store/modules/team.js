import { ENTER_TEAM, ENTER_CONFERENCE } from '../types'
const state = {
  teamID: parseInt(localStorage.getItem('teamID')),
  conferenceID: parseInt(localStorage.getItem('conferenceID'))
}

const mutations = {
  [ENTER_TEAM] (stateLocal, teamID) {
    localStorage.setItem('teamID', teamID)
    stateLocal.teamID = parseInt(teamID)
  },
  [ENTER_CONFERENCE] (stateLocal, conferenceID) {
    localStorage.setItem('conferenceID', conferenceID)
    stateLocal.conferenceID = parseInt(conferenceID)
  }
}

export default {
  state,
  mutations
}
