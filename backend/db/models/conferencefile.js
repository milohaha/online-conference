'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ConferenceFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      ConferenceFile.belongsTo(models.Conference, { as: 'conference', foreignKey: 'conferenceID' })
    }
  }
  ConferenceFile.init({
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
    fileID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fileContent: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    fileLeft: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    fileTop: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ConferenceFile',
    modelName: 'ConferenceFile'
  })
  return ConferenceFile
}
