const express = require('express')
const router = express.Router()
const publicMethods = require('../methods/public')
const userMethods = require('../methods/user')
const constant = require('../utils/constant')
const jsonwebtoken = require('jsonwebtoken')
const database = require('../db/models/index')
const sequelize = database.sequelize
const User = sequelize.models.User
// 查找所有用户并打印的实例
// User.findAll().then(users => { console.log('All users:', JSON.stringify(users, null, 2)) })
// 创建用户到数据库的用法实例
// const createUser = async (name, password, email) => {
//   await sequelize.models.User.create({
//     name: name,
//     password: password,
//     email: email
//   })
// }

/* GET home page. */
router.get('/', async (request, response, next) => {
  response.send('home page')
})

// login
router.post('/login', async (request, response, next) => {
  try {
    let { userName, password } = request.body
    password = publicMethods.md5(`${password}${constant.SALT_KEY}`)
    const user = await User.findAll({
      where: {
        username: userName,
        password: password
      }
    })
    console.log(JSON.stringify(user, null, 2))
    if (user && user.length !== 0) {
      const token = jsonwebtoken.sign({ userName }, constant.PRIVATE_KEY, { expiresIn: constant.EXPIRED })
      response.json({
        code: constant.CODE_SUCCESS,
        message: 'USER_LOGININ',
        token: token
      })
    } else {
      response.json({
        code: constant.CODE_ERROR,
        message: 'WRONG_PASSWORD'
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
      password = publicMethods.md5(`${password}${constant.SALT_KEY}`)
      await userMethods.createUser(userName, password, email)
      const token = jsonwebtoken.sign({ userName }, constant.PRIVATE_KEY, { expiresIn: constant.EXPIRED })
      response.json({
        code: constant.CODE_SUCCESS,
        message: 'USER_REGISTER',
        token: token
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router
