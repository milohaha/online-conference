'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate (models) {
      // define association here
      Team.hasMany(models.Conference, { as: 'Conferences', foreignKey: 'teamID' })
      Team.hasMany(models.UserTeam, { as: 'UserTeams', foreignKey: 'teamID' })
      Team.hasMany(models.Verification, { as: 'Verifications', foreignKey: 'teamID' })
      Team.belongsTo(models.User, { as: 'founder', foreignKey: 'founderID' })
    }
  }
  Team.init({
    teamName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    founderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'userName'
      }
    }
  }, {
    sequelize,
    modelName: 'Team',
    tableName: 'Team'
  })
  return Team
}
