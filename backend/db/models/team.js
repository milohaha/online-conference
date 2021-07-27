'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Team.belongsTo(models.User, {
        foreignKey: 'founderid',
        onDelete: 'CASCADE'
      })
    }
  }
  Team.init({
    teamname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    founderid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Team',
    tableName: 'teams'
  })
  return Team
}
