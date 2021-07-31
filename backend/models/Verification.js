const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Verification', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
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
    tableName: 'Verification',
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
        name: "senderID",
        using: "BTREE",
        fields: [
          { name: "senderID" },
        ]
      },
      {
        name: "receiverID",
        using: "BTREE",
        fields: [
          { name: "receiverID" },
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
