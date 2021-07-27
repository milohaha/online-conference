const publicMethods = require('public')
const database = require('../db/models')
const models = database.sequelize.models
module.exports = {
  createUser: async function (username, password, email) {
    if (!publicMethods.checkString(username)) {
      return 'Username Error'
    }
    if (!publicMethods.checkString(password)) {
      return 'Password Error'
    }
    if (!publicMethods.checkString(email)) {
      return 'Email Error'
    }
    await models.User.create({
      username: username,
      password: password,
      email: email
    })
    return 'USER_REGISTER'
  }
}
