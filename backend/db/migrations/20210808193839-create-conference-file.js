'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConferenceFile', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conferenceID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Conference',
          key: 'id'
        }
      },
      fileID: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fileContent: {
        allowNull: false,
        type: Sequelize.TEXT('medium')
      },
      fileLeft: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      fileTop: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ConferenceFile')
  }
}
