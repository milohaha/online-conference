const express = require('express')
const router = express.Router()
const publicMethods = require('../methods/public')
const userMethods = require('../methods/user')
const noticeMethods = require('../methods/notice')
const constant = require('../utils/constant')
const jsonwebtoken = require('jsonwebtoken')
const { models } = require('../utils/database')

/* GET home page. */
router.get('/', async (request, response, next) => {
  response.send('home page')
})

// login
router.post('/login', async (request, response, next) => {
  let { userName, password } = request.body
  password = publicMethods.sha512(`${password}`)
  const user = await publicMethods.getObjects(models.User, { userName: userName, password: password })
  if (user && user.length !== 0) {
    const userID = user[0].id
    const token = jsonwebtoken.sign({ userID: userID, userName: userName }, constant.PRIVATE_KEY, { expiresIn: constant.EXPIRED })
    const expireTime = (Date.now() + constant.EXPIRED * 1000).toString()
    response.json({
      code: constant.CODE_SUCCESS,
      message: 'USER_LOGIN',
      userID: userID,
      token: token,
      expireTime: expireTime
    })
  } else {
    response.json({
      code: constant.CODE_ERROR,
      message: 'WRONG_USERNAME_OR_PASSWORD'
    })
  }
})

// register
router.post('/register', async (request, response, next) => {
  let { userName, password, email } = request.body
  const user = await publicMethods.getObjects(models.User, { userName: userName })
  if (user && user.length !== 0) {
    response.json({
      code: constant.CODE_ERROR,
      message: 'ALREADY_REGISTERED'
    })
  } else {
    password = publicMethods.sha512(`${password}`)
    await userMethods.createUser(userName, password, email)
    response.json({
      code: constant.CODE_SUCCESS,
      message: 'USER_REGISTER'
    })
  }
})

// check notices and verifications
router.post('/getMessage', async (request, response, next) => {
  const { type, userID } = request.body
  let data = await noticeMethods.getNoticeOrVerification(type, userID)
  if (type === 'verification') {
    const results = []
    for (const datum of data) {
      const senderName = await publicMethods.getNameByID(models.User, datum.senderID)
      const teamName = await publicMethods.getNameByID(models.Team, datum.teamID)
      const typeString = datum.type === 'application' ? '申请' : '邀请您'
      const content = senderName + typeString + '加入团队：' + teamName
      results.push({
        id: datum.id,
        type: datum.type,
        content: content,
        createdAt: datum.createdAt,
        updatedAt: datum.updatedAt
      })
    }
    data = results
  }
  response.json({ data: data })
})

router.post('/deleteObjects', async (request, response, next) => {
  let { model, condition } = request.body
  switch (model) {
    case 'User':
      model = models.User
      break
    case 'Team':
      model = models.Team
      break
    default:
      model = models.User
  }
  await model.destroy({ where: condition })
  response.json({ message: 'ok' })
})

module.exports = router
