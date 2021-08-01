'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserTeam extends Model {
    static associate (models) {
      // define association here
      UserTeam.belongsTo(models.Team, { as: 'team', foreignKey: 'teamID' })
      UserTeam.belongsTo(models.User, { as: 'user', foreignKey: 'userID' })
    }
  }
  UserTeam.init({
    userID: {
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
    modelName: 'UserTeam',
    tableName: 'UserTeam'
  })
  return UserTeam
}
