const express = require('express')
const router = express.Router()
const { models } = require('../utils/database')

const teamMethods = require('../methods/team')
const publicMethods = require('../methods/public')
const { v1: uuid } = require('uuid')
const constant = require('../utils/constant')

router.post('/createGroup', async (request, response, next) => {
  const userID = request.user.userID
  const groupName = request.body.groupName
  const teamID = request.body.teamID
  const result = await teamMethods.createGroup(groupName, userID, teamID)
  return response.json(result)
})

router.post('/conferenceMembers', async (request, response, next) => {
  const conferenceID = request.body.conferenceID
  const memberIDs = request.body.memberIDs
  for (const memberID of memberIDs) {
    await models.UserConference.create({
      userID: memberID,
      conferenceID: conferenceID
    })
  }
  return response.json({ message: 'SUCCESS' })
})

router.post('/getMembers', async function (request, response, next) {
  const { groupID, inGroup, groupType } = request.body
  const allUsers = await publicMethods.getObjects(models.User, {})
  const members = []
  for (const user of allUsers) {
    if (groupType === 'Team') {
      const inGroupResult = await publicMethods.getObjects(models.UserTeam, { teamID: groupID, userID: user.id })
      const isInGroup = (inGroupResult) && (inGroupResult.length !== 0)
      if (isInGroup.toString() === inGroup.toString()) {
        members.push({ id: user.id, userName: user.userName, email: user.email })
      }
    } else if (groupType === 'Conference') {
      const inConferenceResult = await publicMethods.getObjects(models.UserConference, { conferenceID: groupID, userID: user.id })
      const isInConference = (inConferenceResult) && (inConferenceResult.length !== 0)
      if (inGroup.toString() === 'true' && isInConference) {
        members.push({ id: user.id, userName: user.userName, email: user.email })
      } else if (inGroup.toString() === 'false') {
        const conferenceInformation = await publicMethods.getObjects(models.Conference, { id: groupID })
        const inTeamResult = await publicMethods.getObjects(models.UserTeam, { UserID: user.id, teamID: conferenceInformation[0].teamID })
        const isInTeam = (inTeamResult) && (inTeamResult.length !== 0)
        if (!isInConference && isInTeam) {
          members.push({ id: user.id, userName: user.userName, email: user.email })
        }
      }
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

router.post('/getActiveConferenceUsers', async function (request, response, next) {
  const conferenceID = request.body.conferenceID
  if (conferenceID === undefined) {
    response.json({ activeUsers: [] })
  }
  const activeUserIDs = await models.ActiveUserConference.findAll({
    where: {
      conferenceID: conferenceID
    }
  })
  const activeUsers = []
  for (const activeUserID of activeUserIDs) {
    const user = await models.User.findAll({
      where: {
        id: activeUserID.userID
      }
    })
    activeUsers.push({ id: user[0].id, userName: user[0].userName, email: user[0].email })
  }
  response.json({ members: activeUsers })
})

router.post('/generateConferenceToken', async function (request, response, next) {
  const conferenceID = request.body.conferenceID
  if (conferenceID === undefined) {
    response.json({ message: 'UNDEFINED' })
  }
  const object = await models.Conference.findOne({
    where: {
      id: conferenceID
    }
  })
  if (!object) {
    response.json({ message: 'INVALID' })
  } else {
    const conferenceToken = uuid()
    await models.ConferenceToken.create({
      conferenceID: object.id,
      conferenceToken: conferenceToken,
      expiredTime: Date.now() + constant.EXPIRED * 1000
    })
    response.json({
      message: 'SUCCESS',
      conferenceToken: conferenceToken
    })
  }
})

router.post('/checkConferenceToken', async function (request, response, next) {
  const userID = request.user.userID
  const conferenceID = request.body.conferenceID
  const conferenceToken = request.body.conferenceToken
  if (conferenceID === undefined) {
    response.json({ message: 'UNDEFINED' })
  }
  const authority = await models.UserConference.findOne({
    where: {
      userID: userID,
      conferenceID: conferenceID
    }
  })
  if (authority) {
    response.json({
      message: 'VALID',
      expired: false,
      isVisitor: false
    })
  }
  if (conferenceToken === undefined) {
    response.json({ message: 'UNDEFINED' })
  }
  const object = await models.ConferenceToken.findOne({
    where: {
      conferenceID: conferenceID,
      conferenceToken: conferenceToken
    }
  })
  if (!object) {
    response.json({ message: 'INVALID' })
  } else {
    response.json({
      message: 'VALID',
      expired: object.expiredTime < Date.now(),
      isVisitor: true
    })
  }
})

module.exports = router
