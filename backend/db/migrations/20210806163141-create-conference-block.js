'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConferenceBlock', {
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
      itemID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      itemLeft: {
        type: Sequelize.FLOAT
      },
      itemTop: {
        type: Sequelize.FLOAT
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contents: {
        type: Sequelize.STRING(2048)
      },
      language: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ConferenceBlock')
  }
}
