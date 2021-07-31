const { models } = require('../utils/database')
const crypto = require('crypto')
const { IS_TEAM, IS_CONFERENCE } = require('../utils/constant')
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
      return user[0].userName
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
  },
  findGroupUserIDs: async function (conferenceOrTeam, conferenceOrTeamID) {
    let objects
    if (conferenceOrTeamID === IS_TEAM) {
      objects = await this.getObjects(models.UserTeam, {})
    } else {
      objects = await this.getObjects(models.UserConference, {})
    }
    const userIDs = []
    for (const object of objects) {
      userIDs.push(object.userID)
    }
    return userIDs
  }
}
