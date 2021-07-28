const publicMethods = require('../methods/public')
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
    const user = await models.User.findAll({
      where: {
        username: userName
      }
    })
    if (!(user === undefined || user.length === 0)) {
      return 'USER_EXIST'
    }
    models.User.create({
      username: userName,
      password: password,
      email: email
    }).then(data => {
      return 'USER_REGISTER'
    })
    setTimeout(() => {
      return 'CONNECT_ERROR'
    }, 1000)
  }
}
