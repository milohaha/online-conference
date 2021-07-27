const publicMethods = require('public')
const database = require('../db/models')
const models = database.sequelize.models
module.exports = {
  createUser: async function (userName, password, email) {
    if (!publicMethods.checkString(userName)) {
      return 'Username Error'
    }
    if (!publicMethods.checkString(password)) {
      return 'Password Error'
    }
    if (!publicMethods.checkString(email)) {
      return 'Email Error'
    }
    await models.User.create({
      username: userName,
      password: password,
      email: email
    })
    return 'USER_REGISTER'
  }
}
