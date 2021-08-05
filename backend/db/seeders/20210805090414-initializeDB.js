'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('User', [{
      userName: 'test1',
      password: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
      email: 'test1@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      userName: 'test2',
      password: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
      email: 'test2@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
    await queryInterface.bulkInsert('Team', [{
      teamName: 'testTeam',
      founderID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
    await queryInterface.bulkInsert('UserTeam', [{
      userID: 1,
      teamID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
    await queryInterface.bulkInsert('Conference', [{
      conferenceName: 'testConference',
      founderID: 1,
      teamID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
    await queryInterface.bulkInsert('UserConference', [{
      userID: 1,
      conferenceID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {})
    await queryInterface.bulkDelete('Team', null, {})
    await queryInterface.bulkDelete('UserTeam', null, {})
    await queryInterface.bulkDelete('Conference', null, {})
    await queryInterface.bulkDelete('UserConference', null, {})
  }
}
