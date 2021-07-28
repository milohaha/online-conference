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

module.exports = router
