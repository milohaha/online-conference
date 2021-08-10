'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CommentBlock', {
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
      commentBlockID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stickBlockID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      left: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      top: {
        type: Sequelize.FLOAT,
        allowNull: false
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
    await queryInterface.dropTable('CommentBlock')
  }
}
