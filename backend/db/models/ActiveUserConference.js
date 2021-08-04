'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ActiveUserConference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      ActiveUserConference.belongsTo(models.Conference, { as: 'conference', foreignKey: 'conferenceID' })
      ActiveUserConference.belongsTo(models.User, { as: 'user', foreignKey: 'userID' })
    }
  }
  ActiveUserConference.init({
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
    modelName: 'ActiveUserConference',
    tableName: 'ActiveUserConference'
  })
  return ActiveUserConference
}
