'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserNotice extends Model {
    static associate (models) {
      // define association here
      UserNotice.belongsTo(models.Notice, { as: 'notice', foreignKey: 'noticeID' })
      UserNotice.belongsTo(models.User, { as: 'user', foreignKey: 'userID' })
    }
  }
  UserNotice.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    noticeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Notice',
        key: 'id'
      }
    },
    hasRead: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserNotice',
    tableName: 'UserNotice'
  })
  return UserNotice
}
