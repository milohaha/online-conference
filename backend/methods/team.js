const publicMethods = require('public')
const database = require('../db/models')
const models = database.sequelize.models
module.exports = {
  createTeam: async function (teamName, userId) {
    if (!publicMethods.checkString(userId)) {
      return 'User Error'
    }
    if (!publicMethods.checkString(teamName)) {
      return 'TeamName Error'
    }
    if (await publicMethods.getObjectId(models.Team, teamName) === '') {
      await models.Team.create({ teamname: teamName, founderid: userId })
      return 'created'
    } else {
      return 'exists'
    }
  }
}
