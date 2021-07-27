const express = require('express')
const router = express.Router()
const DB = require('../db/models/index')
const models = DB.sequelize.models

function checkString (string) {
  return !(typeof (string) === 'undefined' || string.toString() === '')
}
async function createTeam (teamname, userid) {
  if (!checkString(userid)) { return 'User Error' }
  if (!checkString(teamname)) { return 'Teamname Error' }
  if (getObjectId(models.Team, teamname) === '') {
    await models.Team.create({ name: teamname, founderId: userid })
    return 'created'
  } else {
    return 'exists'
  }
}
async function getObjectId (Model, name) {
  if (!checkString(name)) {
    return 'Name Error'
  }
  Model.findAll({
    where: {
      name: name.toString()
    }
  }).then(data => {
    const object = JSON.stringify(data, null, 2)
    if (Object.keys(object).length !== 0) {
      return object.id.toString()
    } else {
      return ''
    }
  })
}
router.post('/createteam', function (req, res, next) {
  let username
  let teamname
  try {
    username = req.user.username
    teamname = req.body.teamname
  } catch (error) {
    res.json({ message: 'Paras Error' })
  }
  const userid = getObjectId(models.User, username)
  return res.json({ message: createTeam(teamname, userid) })
})

module.exports = router
