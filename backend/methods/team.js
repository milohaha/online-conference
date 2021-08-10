const publicMethods = require('../methods/public')
const { models } = require('../utils/database')

module.exports = {
  // 未传入teamID时创建team,传入teamID时创建conference
  createGroup: async function (groupName, userID, teamID) {
    if (!publicMethods.checkString(groupName)) {
      return { message: 'GROUPNAME_ERROR' }
    }
    groupName = groupName.toString()
    if (!publicMethods.checkString(userID)) {
      return { message: 'USER_ERROR' }
    }
    userID = userID.toString()
    const user = await models.User.findAll({
      where: {
        id: userID
      }
    })
    if (user === undefined || user.length === 0) {
      return { message: 'FOUNDERID_ERROR' }
    }
    const createTeam = !publicMethods.checkString(teamID)
    let objectID
    if (createTeam) {
      objectID = await publicMethods.getObjectID(models.Team, { teamName: groupName })
    } else {
      const teamExistResult = await models.Team.findAll({ where: { id: teamID } })
      if (!(teamExistResult && teamExistResult.length !== 0)) {
        return { message: 'TEAM_NOT_FOUND' }
      }
      teamID = teamID.toString()
      objectID = await publicMethods.getObjectID(models.Conference, { conferenceName: groupName, teamID: teamID })
    }
    if (objectID === '') {
      let newGroupID
      if (createTeam) {
        const newTeam = await models.Team.create({ teamName: groupName, founderID: userID })
        await models.UserTeam.create({ userID: userID, teamID: newTeam.id })
        newGroupID = newTeam.id
      } else {
        const newConference = await models.Conference.create({ conferenceName: groupName, founderID: userID, teamID: teamID })
        await models.UserConference.create({ userID: userID, conferenceID: newConference.id })
        newGroupID = newConference.id
      }
      return { message: 'CREATED', id: newGroupID }
    } else {
      return { message: 'EXISTS' }
    }
  }
}
