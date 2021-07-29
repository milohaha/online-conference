const publicMethods = require('../methods/public')
const database = require('../db/models')
const models = database.sequelize.models
module.exports = {
  createTeam: async function (teamName, userId) {
    if (!publicMethods.checkString(teamName)) {
      return 'TeamName Error'
    }
    if (!publicMethods.checkString(userId)) {
      return 'User Error'
    }
    const user = await models.User.findAll({
      where: {
        id: userId
      }
    })
    if (user === undefined || user.length === 0) {
      return 'FounderId Error'
    }
    const objectId = await publicMethods.getObjectId(models.Team, { teamname: teamName })
    if (objectId === '') {
      await models.Team.create({ teamname: teamName, founderid: userId })
      return 'created'
    } else {
      return 'exists'
    }
  }
}
