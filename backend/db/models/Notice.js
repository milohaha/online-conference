'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    static associate (models) {
      // define association here
      Notice.hasMany(models.UserNotice, { as: 'userNotices', foreignKey: 'noticeID' })
    }
  }
  Notice.init({
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Notice',
    tableName: 'Notice'
  })
  return Notice
}
