const publicMethods = require('../methods/public')
const database = require('../db/models/index')
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
    const user = await models.User.findAll({
      where: {
        username: userName
      }
    })
    if (!(user === undefined || user.length === 0)) {
      return 'USER_EXIST'
    }
    await models.User.create({
      username: userName,
      password: password,
      email: email
    })
    return 'USER_REGISTER'
  }
}
