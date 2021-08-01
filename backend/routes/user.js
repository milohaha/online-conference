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
  try {
    let { userName, password } = request.body
    password = publicMethods.sha512(`${password}`)
    const user = await models.User.findAll({
      where: {
        userName: userName,
        password: password
      }
    })
    if (user && user.length !== 0) {
      const userID = user[0].id
      const token = jsonwebtoken.sign({ userID: userID, userName: userName }, constant.PRIVATE_KEY, { expiresIn: constant.EXPIRED })
      const expireTime = (Date.now() + constant.EXPIRED * 1000).toString()
      response.json({
        code: constant.CODE_SUCCESS,
        message: 'USER_LOGIN',
        token: token,
        expireTime: expireTime
      })
    } else {
      response.json({
        code: constant.CODE_ERROR,
        message: 'WRONG_USERNAME_OR_PASSWORD'
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// register
router.post('/register', async (request, response, next) => {
  let {
    userName,
    password,
    email
  } = request.body
  try {
    const user = await models.User.findAll({
      where: {
        userName: userName
      }
    })
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
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// check notices and verifications
router.get('/getNotice', async (request, response, next) => {
  let type, userID, data
  try {
    type = request.query.type
    userID = request.query.userID
  } catch (error) {
    response.json({ message: 'PARAS_ERROR' })
  }
  data = await noticeMethods.getNoticeOrVerification(type, userID)
  if (type === 'verification') {
    const results = []
    for (const datum of data) {
      const senderName = await publicMethods.getUserNameByID(datum.senderID)
      const teamName = await publicMethods.getTeamNameByID(datum.teamID)
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
  let model, condition
  try {
    switch (request.body.model) {
      case 'User':
        model = models.User
        break
      case 'Team':
        model = models.Team
        break
      default:
        model = models.User
    }
    condition = request.body.condition
  } catch (error) {
    console.log(error)
  }
  await model.destroy({ where: condition })
  response.json({ message: 'ok' })
})

module.exports = router
