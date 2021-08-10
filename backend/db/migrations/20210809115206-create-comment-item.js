'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CommentItem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      commentItemID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      commentBlockID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('CommentItem')
  }
}
