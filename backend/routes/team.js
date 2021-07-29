const express = require('express')
const router = express.Router()
const database = require('../db/models/index')
const models = database.sequelize.models
const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')

router.post('/createteam', async (request, response, next) => {
  let userName
  let teamName
  try {
    userName = request.user.userName
    teamName = request.body.teamName
  } catch (error) {
    response.json({ message: 'Paras Error' })
  }
  const userId = await publicMethods.getObjectId(models.User, userName)
  const result = await teamMethods.createTeam(teamName, userId)
  return response.json({ message: result })
})

router.get('/inviteIntoTeam', async function (request, response, next) {
  try {
    const { teamID } = request.query
    const teamMembers = []
    const allUsers = await models.User.findAll({
      attributes: [['id', 'userID'], 'username']
    })
    if (allUsers && allUsers.length !== 0) {
      for (const user of allUsers) {
        const existResult = await models.UserTeam.findAll({
          where: {
            userID: user.userID,
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

module.exports = router
