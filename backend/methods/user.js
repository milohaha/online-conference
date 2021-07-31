const publicMethods = require('../methods/public')
const { models } = require('../utils/database')

module.exports = {
  createUser: async function (userName, password, email) {
    if (!publicMethods.checkString(userName)) {
      return 'USERNAME_ERROR'
    }
    if (!publicMethods.checkString(password)) {
      return 'PASSWORD_ERROR'
    }
    if (!publicMethods.checkString(email)) {
      return 'EMAIL_ERROR'
    }
    const user = await models.User.findAll({
      where: {
        userName: userName
      }
    })
    if (!(user === undefined || user.length === 0)) {
      return 'USER_EXIST'
    }
    await models.User.create({
      userName: userName,
      password: password,
      email: email
    })
    return 'USER_REGISTER'
  }
}
