const publicMethods = require('../methods/public')
const database = require('../db/models/index')
const models = database.sequelize.models
module.exports = {
  createTeam: async function (teamName, userId) {
    if (!publicMethods.checkString(teamName)) {
      return 'TEAMNAME_ERROR'
    }
    if (!publicMethods.checkString(userId)) {
      return 'USER_ERROR'
    }
    const user = await models.User.findAll({
      where: {
        id: userId
      }
    })
    if (user === undefined || user.length === 0) {
      return 'FOUNDERID_ERROR'
    }
    const objectId = await publicMethods.getObjectId(models.Team, { teamname: teamName })
    if (objectId === '') {
      await models.Team.create({ teamname: teamName, founderid: userId })
      return 'CREATED'
    } else {
      return 'EXISTS'
    }
  }
}
