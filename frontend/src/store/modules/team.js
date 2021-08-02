import { ENTER_TEAM } from '../types'

const state = {
  teamID: 0
}

const mutations = {
  [ENTER_TEAM] (stateLocal, value) {
    stateLocal.teamID = value
  }
}

export default {
  state,
  mutations
}
