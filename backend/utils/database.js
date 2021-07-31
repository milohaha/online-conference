const database = require('../db/models/index')
const initModels = require('../models/init-models')
const sequelize = database.sequelize
const models = initModels(sequelize)
module.exports = {
  sequelize,
  models
}
