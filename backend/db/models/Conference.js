'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Conference extends Model {
    static associate (models) {
      // define association here
      Conference.hasMany(models.UserConference, { as: 'conferenceUser', foreignKey: 'conferenceID' })
      Conference.hasMany(models.ConferenceBoard, { as: 'ConferenceBoard', foreignKey: 'conferenceID' })
      Conference.hasMany(models.ConferenceBlock, { as: 'ConferenceBlock', foreignKey: 'conferenceID' })
      Conference.hasMany(models.ActiveUserConference, { as: 'ActiveUserConference', foreignKey: 'conferenceID' })
      Conference.hasMany(models.ConferenceToken, { as: 'ConferenceToken', foreignKey: 'conferenceID' })
      Conference.hasMany(models.CommentBlock, { as: 'CommentBlock', foreignKey: 'conferenceID' })
      Conference.belongsTo(models.Team, { as: 'team', foreignKey: 'teamID' })
      Conference.belongsTo(models.User, { as: 'founder', foreignKey: 'founderID' })
    }
  }
  Conference.init({
    conferenceName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    founderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    teamID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Team',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Conference',
    tableName: 'Conference'
  })
  return Conference
}
