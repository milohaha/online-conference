'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    static associate (models) {
      // define association here
      Verification.belongsTo(models.Team, { as: 'team', foreignKey: 'teamID' })
      Verification.belongsTo(models.User, { as: 'sender', foreignKey: 'senderID' })
      Verification.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverID' })
      Verification.hasMany(models.UserVerification, { as: 'UserVerifications', foreignKey: 'verificationID' })
    }
  }
  Verification.init({
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    senderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    receiverID: {
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
    modelName: 'Verification',
    tableName: 'Verification'
  })
  return Verification
}
