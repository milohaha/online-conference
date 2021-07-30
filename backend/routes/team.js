const express = require('express')
const router = express.Router()
const database = require('../db/models/index')
const models = database.sequelize.models
const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')

router.post('/createteam', async (request, response, next) => {
  let userID
  let teamName
  try {
    userID = request.user.userID
    teamName = request.body.teamName
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  const result = await teamMethods.createTeam(teamName, userID)
  return response.json({ message: result })
})

router.post('/getMembers', async function (request, response, next) {
  let teamID, inTeam
  try {
    teamID = request.body.teamID
    inTeam = request.body.inTeam
  } catch (error) {
    response.json({ members: [] })
  }
  const allUsers = publicMethods.getObjects(models.User, {})
  const members = []
  for (const user of allUsers) {
    const inTeamResult = publicMethods.getObjects(models.UserTeam, { userID: user.id, teamID: teamID })
    const isInTeam = (inTeamResult) && (inTeamResult.length !== 0)
    if (isInTeam.toString() === inTeam.toString()) {
      members.push({ id: user.id, userName: user.username, email: user.email })
    }
  }
  response.json({ members: members })
})

router.post('/checkTeam', async function (request, response, next) {
  let teamID, userID
  try {
    teamID = request.body.teamID
    userID = request.user.userID
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  const teamExistResult = await publicMethods.getObjectID(models.Team, { id: teamID })
  if (!publicMethods.checkString(teamExistResult)) {
    return response.json({ message: 'NOT_EXIST' })
  }
  const existResult = await models.UserTeam.findAll({
    where: {
      userID: userID,
      teamID: teamID
    }
  })
  if (existResult && existResult.length !== 0) {
    return response.json({ message: 'HAS_JOINED' })
  } else {
    return response.json({ message: 'NOT_JOINED' })
  }
})

module.exports = router
