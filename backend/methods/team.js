const publicMethods = require('../methods/public')
const database = require('../db/models/index')
const models = database.sequelize.models
module.exports = {
  createTeam: async function (teamName, userID) {
    if (!publicMethods.checkString(teamName)) {
      return 'TEAMNAME_ERROR'
    }
    if (!publicMethods.checkString(userID)) {
      return 'USER_ERROR'
    }
    const user = await models.User.findAll({
      where: {
        id: userID
      }
    })
    if (user === undefined || user.length === 0) {
      return 'FOUNDERID_ERROR'
    }
    const objectID = await publicMethods.getObjectID(models.Team, { teamname: teamName })
    if (objectID === '') {
      await models.Team.create({ teamname: teamName, founderid: userID })
      return 'CREATED'
    } else {
      return 'EXISTS'
    }
  }
}
