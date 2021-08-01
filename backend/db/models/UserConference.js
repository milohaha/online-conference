'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserConference extends Model {
    static associate (models) {
      // define association here
      UserConference.belongsTo(models.Conference, { as: 'conference', foreignKey: 'conferenceID' })
      UserConference.belongsTo(models.User, { as: 'user', foreignKey: 'userID' })
    }
  }
  UserConference.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    conferenceID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conference',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserConference',
    tableName: 'UserConference'
  })
  return UserConference
}
