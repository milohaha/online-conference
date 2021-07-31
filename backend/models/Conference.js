const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Conference', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
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
    tableName: 'Conference',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "founderID",
        using: "BTREE",
        fields: [
          { name: "founderID" },
        ]
      },
      {
        name: "teamID",
        using: "BTREE",
        fields: [
          { name: "teamID" },
        ]
      },
    ]
  });
};
