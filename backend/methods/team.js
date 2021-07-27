const publicMethods = require('public')
const database = require('../db/models')
const models = database.sequelize.models
module.exports = {
  createTeam: async function (teamname, userid) {
    if (!publicMethods.checkString(userid)) {
      return 'User Error'
    }
    if (!publicMethods.checkString(teamname)) {
      return 'Teamname Error'
    }
    if (publicMethods.getObjectId(models.Team, teamname) === '') {
      await models.Team.create({ teamname: teamname, founderid: userid })
      return 'created'
    } else {
      return 'exists'
    }
  }
}
