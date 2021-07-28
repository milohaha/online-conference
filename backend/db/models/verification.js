'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Verification.hasMany(models.UserVerification, {
        foreignKey: 'id'
      })
    }
  }
  Verification.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    applicantID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    conferenceOrTeamID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Verification'
  })
  return Verification
}
