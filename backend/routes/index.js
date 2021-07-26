const express = require('express')
const router = express.Router()
const { md5 } = require('../utils/index')
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, EXPIRED, SALT_KEY } = require('../utils/constant')
const jwt = require('jsonwebtoken')
const db = require('../db/models/index')
const sequelize = db.sequelize
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
router.get('/', function (req, res, next) {
  res.send('home page')
})

// login
router.post('/login', async (request, response, next) => {
  try {
    let { username, password } = request.body
    password = md5(`${password}${SALT_KEY}`)
    const user = await User.findAll({
      where: {
        username: username,
        password: password
      }
    })
    console.log(JSON.stringify(user, null, 2))
    if (user && user.length !== 0) {
      const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRED })
      response.json({
        code: CODE_SUCCESS,
        message: 'USER_LOGININ',
        token: token
      })
    } else {
      response.json({
        code: CODE_ERROR,
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
    username,
    password,
    email
  } = request.body
  try {
    const user = await User.findAll({
      where: {
        username: username
      }
    })
    if (user && user.length !== 0) {
      response.json({
        code: CODE_ERROR,
        message: 'ALREADY_REGISTERED'
      })
    } else {
      password = md5(`${password}${SALT_KEY}`)
      await User.create({
        username: username,
        password: password,
        email: email
      })
      const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRED })
      response.json({
        code: CODE_SUCCESS,
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
