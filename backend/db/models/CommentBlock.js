'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CommentBlock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      CommentBlock.belongsTo(models.Conference, { as: 'conference', foreignKey: 'conferenceID' })
    }
  }
  CommentBlock.init({
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
    commentBlockID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    stickBlockID: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    left: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    top: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'CommentBlock',
    modelName: 'CommentBlock'
  })
  return CommentBlock
}
