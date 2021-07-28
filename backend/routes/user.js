const express = require('express')
const router = express.Router()
const publicMethods = require('../methods/public')
const userMethods = require('../methods/user')
const constant = require('../utils/constant')
const jsonwebtoken = require('jsonwebtoken')
const database = require('../db/models/index')
const sequelize = database.sequelize
const User = sequelize.models.User

/* GET home page. */
router.get('/', async (request, response, next) => {
  response.send('home page')
})

// login
router.post('/login', async (request, response, next) => {
  try {
    let { userName, password } = request.body
    password = publicMethods.sha512(`${password}`)
    const user = await User.findAll({
      where: {
        username: userName,
        password: password
      }
    })
    console.log(JSON.stringify(user, null, 2))
    if (user && user.length !== 0) {
      const token = jsonwebtoken.sign({ userName }, constant.PRIVATE_KEY, { expiresIn: constant.EXPIRED })
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
    const user = await User.findAll({
      where: {
        username: userName
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

module.exports = router
