'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserVerification extends Model {
    static associate (models) {
      // define association here
      UserVerification.belongsTo(models.User, { as: 'user', foreignKey: 'userID' })
      UserVerification.belongsTo(models.Verification, { as: 'verification', foreignKey: 'verificationID' })
    }
  }
  UserVerification.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    verificationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Verification',
        key: 'id'
      }
    },
    hasSolved: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserVerification',
    tableName: 'UserVerification'
  })
  return UserVerification
}
