'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CommentItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  CommentItem.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    commentItemID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    commentBlockID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'CommentItem',
    modelName: 'CommentItem'
  })
  return CommentItem
}
