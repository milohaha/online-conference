'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserNotice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      UserNotice.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE'
      })
      UserNotice.belongsTo(models.Notice, {
        foreignKey: 'noticeID',
        onDelete: 'CASCADE'
      })
    }
  }
  UserNotice.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    noticeID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hasRead: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserNotice'
  })
  return UserNotice
}
