const teamMethods = require('../methods/team')
const database = require('../db/models/index')
const sequelize = database.sequelize
const Team = sequelize.models.Team
const User = sequelize.models.User
const Conference = sequelize.models.Conference

describe('createGroup', () => {
  describe('createTeam', () => {
    test('no paras should return GroupName Error', async () => {
      const result = await teamMethods.createGroup()
      expect(result).toBe('GROUPNAME_ERROR')
    })
    test('one paras should return User Error', async () => {
      const result = await teamMethods.createGroup('name')
      expect(result).toBe('USER_ERROR')
    })
    test('if team created, return created', async () => {
      const user = await User.create({ username: 'testname', password: 'testpassword', email: 'testemail' })
      const result = await teamMethods.createGroup('testteam', user.id)
      await Team.destroy({
        where: {
          teamname: 'testteam'
        }
      })
      await User.destroy({
        where: {
          username: 'testname',
          password: 'testpassword',
          email: 'testemail'
        }
      })
      expect(result).toBe('CREATED')
    })
    test('if user doesnt exist, return FounderId Error', async () => {
      const result = await teamMethods.createGroup('team', -2)
      expect(result).toBe('FOUNDERID_ERROR')
    })
  })
  describe('createConference', () => {
    test('if teamID not found,return Team Not Found', async () => {
      const user = await User.create({ username: 'testname', password: 'testpassword', email: 'testemail' })
      const result = await teamMethods.createGroup('hello', user.id, 2)
      await User.destroy({
        where: {
          username: 'testname',
          password: 'testpassword',
          email: 'testemail'
        }
      })
      expect(result).toEqual('TEAM_NOT_FOUND')
    })
    test('if Conference created,return Created', async () => {
      const user = await User.create({ username: 'testname', password: 'testpassword', email: 'testemail' })
      const team = await teamMethods.createGroup('testteam', user.id)
      await Team.destroy({
        where: {
          teamname: 'testteam'
        }
      })
      await User.destroy({
        where: {
          username: 'testname',
          password: 'testpassword',
          email: 'testemail'
        }
      })
      const result = await teamMethods.createGroup('hello', user.id, team.id)
      await Conference.destroy({ where: { conferenceName: 'hello', userID: user.id, teamID: team.id } })
      expect(result).toEqual('CREATED')
    })
  })
})
