const express = require('express')
const router = express.Router()
const database = require('../db/models/index')
const models = database.sequelize.models
const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')

router.post('/createteam', async (request, response, next) => {
  let userId
  let teamName
  try {
    userId = request.user.userId
    teamName = request.body.teamName
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  const result = await teamMethods.createTeam(teamName, userId)
  return response.json({ message: result })
})

router.get('/getMembers', async function (request, response, next) {
  try {
    const { teamID } = request.query
    const teamMembers = []
    const allUsers = await models.User.findAll({
      attributes: ['id', 'username']
    })
    if (allUsers && allUsers.length !== 0) {
      for (const user of allUsers) {
        const existResult = await models.UserTeam.findAll({
          where: {
            userID: user.id,
            teamID: teamID
          }
        })
        if (existResult && existResult.length !== 0) {
          teamMembers.push({ userName: user.username, ifInTeam: true })
        } else {
          teamMembers.push({ userName: user.username, ifInTeam: false })
        }
      }
    }
    response.json({ teamMembers: teamMembers })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/checkTeam', async function (request, response, next) {
  let teamID, userID
  try {
    teamID = request.body.teamID
    userID = request.user.userId
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  const teamExistResult = await publicMethods.getObjectId(models.Team, { id: teamID })
  if (!publicMethods.checkString(teamExistResult)) {
    return response.json({ message: 'NOT_EXIST ' })
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
