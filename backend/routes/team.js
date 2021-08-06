const express = require('express')
const router = express.Router()
const { models } = require('../utils/database')

const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')

router.post('/createGroup', async (request, response, next) => {
  const userID = request.user.userID
  const groupName = request.body.groupName
  const teamID = request.body.teamID
  const result = await teamMethods.createGroup(groupName, userID, teamID)
  return response.json({ message: result })
})

router.post('/conferenceMembers', async (request, response, next) => {
  const conferenceName = request.body.conferenceName
  const memberIDs = request.body.memberIDs
  const newConference = await publicMethods.getObjects(models.Conference, { conferenceName: conferenceName })
  for (const memberID of memberIDs) {
    await models.UserConference.create({
      userID: memberID,
      conferenceID: newConference[0].id
    })
  }
  return response.json({ message: 'SUCCESS' })
})

router.post('/getMembers', async function (request, response, next) {
  const { groupID, inGroup, groupType } = request.body
  const allUsers = await publicMethods.getObjects(models.User, {})
  const members = []
  for (const user of allUsers) {
    let inGroupResult
    if (groupType === 'Team') {
      inGroupResult = await publicMethods.getObjects(models.UserTeam, { teamID: groupID, userID: user.id })
    } else if (groupType === 'Conference') {
      inGroupResult = await publicMethods.getObjects(models.UserConference, { conferenceID: groupID, userID: user.id })
    }
    const isInGroup = (inGroupResult) && (inGroupResult.length !== 0)
    if (isInGroup.toString() === inGroup.toString()) {
      members.push({ id: user.id, userName: user.userName, email: user.email })
    }
  }
  response.json({ members: members })
})

router.post('/checkTeam', async function (request, response, next) {
  const userID = request.user.userID
  const teamID = request.body.teamID
  const teamExistResult = await publicMethods.getObjectID(models.Team, { id: teamID })
  if (!publicMethods.checkString(teamExistResult)) {
    return response.json({ message: 'NOT_EXIST' })
  }
  const existResult = await publicMethods.getObjects(models.UserTeam, { userID: userID, teamID: teamID })
  if (existResult && existResult.length !== 0) {
    return response.json({ message: 'HAS_JOINED' })
  } else {
    return response.json({ message: 'NOT_JOINED' })
  }
})

router.post('/getObjects', async function (request, response, next) {
  const { model, condition } = request.body
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
router.post('/getConferences', async function (request, response, next) {
  const userID = request.body.userID
  const teamID = request.body.teamID
  const conferenceIDs = await publicMethods.getObjects(models.UserConference, { userID: userID })
  const result = []
  for (const conferenceID of conferenceIDs) {
    const conference = await publicMethods.getObjects(models.Conference, { id: conferenceID.conferenceID, teamID: teamID })
    if (conference && conference.length !== 0) {
      result.push({ id: conference[0].id, conferenceName: conference[0].conferenceName })
    }
  }
  response.json({ conferences: result })
})
router.post('/getTeamBuiltByMe', async function (request, response, next) {
  const userID = request.body.userID
  const teams = await publicMethods.getObjects(models.Team, { founderID: userID })
  const result = []
  for (const team of teams) {
    result.push({ id: team.id, teamName: team.teamName })
  }
  response.json({ teams: result })
})

router.post('/getTeamJoined', async function (request, response, next) {
  const userID = request.body.userID
  if (userID === undefined) {
    response.json({ teams: [] })
  }
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
    const teamName = await publicMethods.getNameByID(models.Team, teamID)
    result.push({ id: teamID, teamName: teamName })
  }
  response.json({ teams: result })
})

module.exports = router
