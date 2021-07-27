const express = require('express')
const router = express.Router()
const database = require('../db/models/index')
const models = database.sequelize.models
const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')

router.post('/createteam', function (req, res, next) {
  let username
  let teamname
  try {
    username = req.user.username
    teamname = req.body.teamname
  } catch (error) {
    res.json({ message: 'Paras Error' })
  }
  const userid = publicMethods.getObjectId(models.User, username)
  return res.json({ message: teamMethods.createTeam(teamname, userid) })
})

module.exports = router
