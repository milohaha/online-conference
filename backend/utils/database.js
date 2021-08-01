const database = require('../db/models/index')
const sequelize = database.sequelize
const models = sequelize.models

const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')
AdminBro.registerAdapter(AdminBroSequelize)
const adminBro = new AdminBro({
  databases: [database],
  branding: {
    companyName: 'SpaceAdmin~'
  },
  resources: [{
    resource: database.Conference,
    options: { properties: { conferenceName: { isTitle: true } } }
  }, {
    resource: database.Notice,
    options: { properties: { id: { isTitle: true } } }
  }, {
    resource: database.Team,
    options: { properties: { teamName: { isTitle: true } } }
  }, {
    resource: database.User,
    options: { properties: { userName: { isTitle: true } } }
  }, {
    resource: database.UserConference,
    options: { properties: { id: { isTitle: true } } }
  }, {
    resource: database.UserNotice,
    options: { properties: { id: { isTitle: true } } }
  }, {
    resource: database.UserTeam,
    options: { properties: { id: { isTitle: true } } }
  }, {
    resource: database.UserVerification,
    options: { properties: { id: { isTitle: true } } }
  }, {
    resource: database.Verification,
    options: { properties: { id: { isTitle: true } } }
  }
  ]
})
const adminBroRouter = AdminBroExpress.buildRouter(adminBro)

module.exports = {
  database,
  sequelize,
  models,
  adminBroRouter
}
