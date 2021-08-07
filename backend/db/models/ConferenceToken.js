'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ConferenceToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      ConferenceToken.belongsTo(models.Conference, { as: 'conference', foreignKey: 'conferenceID' })
    }
  }
  ConferenceToken.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    conferenceID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conference',
        key: 'id'
      }
    },
    conferenceToken: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expiredTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ConferenceToken',
    modelName: 'ConferenceToken'
  })
  return ConferenceToken
}
