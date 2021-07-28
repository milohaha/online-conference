'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserVerification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      UserVerification.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE'
      })
      UserVerification.belongsTo(models.Verification, {
        foreignKey: 'verificationID',
        onDelete: 'CASCADE'
      })
    }
  }
  UserVerification.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    verificationID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hasSolved: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserVerification'
  })
  return UserVerification
}
