'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ConferenceBoard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      ConferenceBoard.belongsTo(models.Conference, { as: 'conference', foreignKey: 'conferenceID' })
    }
  }
  ConferenceBoard.init({
    conferenceID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conference',
        key: 'id'
      }
    },
    itemID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    itemDetails: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ConferenceBoard',
    tableName: 'ConferenceBoard'
  })
  return ConferenceBoard
}
