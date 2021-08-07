'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ConferenceBlock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      ConferenceBlock.belongsTo(models.Conference, { as: 'conference', foreignKey: 'conferenceID' })
    }
  }
  ConferenceBlock.init({
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
    itemID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    itemLeft: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    itemTop: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contents: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ConferenceBlock',
    modelName: 'ConferenceBlock'
  })
  return ConferenceBlock
}
