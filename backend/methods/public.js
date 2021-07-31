const crypto = require('crypto')
const database = require('../db/models/index')
const models = database.sequelize.models
const { IS_CONFERENCE, IS_TEAM } = require('../utils/constant')
module.exports = {
  sha512: (password) => {
    if (password === undefined) {
      password = ''
    }
    const sha512 = crypto.createHash('sha512')
    return sha512.update(password).digest('hex')
  },
  checkString: function (string) {
    return !(string === undefined || string.toString() === '')
  },
  getObjects: async function (Model, condition) {
    if (Model === undefined || condition === undefined) {
      return {}
    }
    let objects
    try {
      Object.keys(condition).forEach(key => {
        condition[key] = condition[key].toString()
      })
      objects = await Model.findAll({
        where: condition
      })
    } catch (error) {
      return {}
    }
    return objects
  },
  getObjectID: async function (Model, condition) {
    const objects = await this.getObjects(Model, condition)
    try {
      return objects[0].id
    } catch (error) {
      return ''
    }
  },
  getUserNameByID: async function (userID) {
    const user = await this.getObjects(models.User, { id: userID })
    try {
      return user[0].username
    } catch (error) {
      return ''
    }
  },
  findGroup: async function (conferenceOrTeam, conferenceOrTeamID) {
    let group
    if (conferenceOrTeam === IS_TEAM) {
      group = await this.getObjects(models.Team, { id: conferenceOrTeamID })
    } else if (conferenceOrTeam === IS_CONFERENCE) {
      group = await this.getObjects(models.Conference, { id: conferenceOrTeamID })
    }
    return group
  }
}
