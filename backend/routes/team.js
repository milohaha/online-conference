const express = require('express')
const router = express.Router()
const { models } = require('../utils/database')

const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')

router.post('/createTeam', async (request, response, next) => {
  let userID
  let teamName
  try {
    userID = request.user.userID
    teamName = request.body.teamName
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  const result = await teamMethods.createGroup(teamName, userID)
  return response.json({ message: result })
})

router.post('/createConference', async (request, response, next) => {
  let userID, teamID, conferenceName
  try {
    userID = request.user.userID
    teamID = request.body.teamID
    conferenceName = request.body.conferenceName
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  const result = await teamMethods.createGroup(conferenceName, userID, teamID)
  return response.json({ message: result })
})

router.post('/getMembers', async function (request, response, next) {
  let groupID, inGroup, groupType
  try {
    groupID = request.body.groupID
    inGroup = request.body.inGroup
    groupType = request.body.groupType
  } catch (error) {
    response.json({ members: [] })
  }
  const allUsers = await publicMethods.getObjects(models.User, {})
  const members = []
  let model, condition
  switch (groupType) {
    case 'Team':
      model = models.UserTeam
      condition = { teamID: groupID }
      break
    case 'Conference':
      model = models.UserConference
      condition = { conferenceID: groupID }
      break
    default: response.json({ members: {} })
  }
  for (const user of allUsers) {
    const inGroupResult = await publicMethods.getObjects(model, condition)
    const isInGroup = (inGroupResult) && (inGroupResult.length !== 0)
    if (isInGroup.toString() === inGroup.toString()) {
      members.push({ id: user.id, userName: user.userName, email: user.email })
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

router.post('/getObjects', async function (request, response, next) {
  let model, condition
  try {
    model = request.body.model.toString()
    condition = request.body.condition
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  let objects
  switch (model) {
    case 'Team':
      objects = await publicMethods.getObjects(models.Team, condition)
      break
    case 'Conference':
      objects = await publicMethods.getObjects(models.Conference, condition)
      break
    default: response.json({})
  }
  response.json({ objects: objects })
})

router.post('/getTeamBuiltByMe', async function (request, response, next) {
  const userID = request.body.userID
  const teams = await publicMethods.getObjects(models.Team, {
    founderID: userID
  })
  const result = []
  for (const team of teams) {
    result.push({ id: team.id, teamName: team.teamName })
  }
  response.json({ teams: result })
})

router.post('/getTeamJoined', async function (request, response, next) {
  const userID = request.body.userID
  const teamsJoined = await models.UserTeam.findAll({
    attributes: [['teamID', 'id']],
    where: {
      userID: userID
    }
  })
  const teamsBuilt = await models.Team.findAll({
    attributes: ['id'],
    where: {
      founderID: userID
    }
  })
  const teams = []
  teamsJoined.forEach((teamJoined) => {
    const index = teamsBuilt.findIndex(teamBuilt => JSON.stringify(teamJoined) === JSON.stringify(teamBuilt))
    if (index === -1) {
      teams.push(teamJoined.id)
    }
  })
  const result = []
  for (const teamID of teams) {
    const teamName = publicMethods.getNameByID(models.Team, teamID)
    result.push({ teamID: teamID, teamName: teamName })
  }
  response.json({ teams: result })
})

module.exports = router
