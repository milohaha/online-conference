const express = require('express')
const router = express.Router()
const database = require('../db/models/index')
const models = database.sequelize.models
const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')

router.post('/createteam', function (request, response, next) {
  let userName
  let teamName
  try {
    userName = request.user.userName
    teamName = request.body.teamName
  } catch (error) {
    response.json({ message: 'Paras Error' })
  }
  const userId = publicMethods.getObjectId(models.User, userName)
  return response.json({ message: teamMethods.createTeam(teamName, userId) })
})

module.exports = router
