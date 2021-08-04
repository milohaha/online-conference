'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      // define association here
      User.hasMany(models.Conference, { as: 'founderConferences', foreignKey: 'founderID' })
      User.hasMany(models.Team, { as: 'founderTeams', foreignKey: 'founderID' })
      User.hasMany(models.UserConference, { as: 'userConferences', foreignKey: 'userID' })
      User.hasMany(models.UserNotice, { as: 'userNotices', foreignKey: 'userID' })
      User.hasMany(models.UserTeam, { as: 'userTeams', foreignKey: 'userID' })
      User.hasMany(models.UserVerification, { as: 'userVerifications', foreignKey: 'userID' })
      User.hasMany(models.Verification, { as: 'senderVerifications', foreignKey: 'senderID' })
      User.hasMany(models.Verification, { as: 'receiverVerifications', foreignKey: 'receiverID' })
      User.hasMany(models.ActiveUserConference, { as: 'ActiveUserConferences', foreignKey: 'userID' })
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User'
  })
  return User
}
