const teamMethods = require('../methods/team')
const { models } = require('../utils/database')
const Team = models.Team
const User = models.User
const Conference = models.Conference

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
      const user = await User.create({ userName: 'testname_teamMethods', password: 'testpassword_teamMethods', email: 'testemail_teamMethods' })
      const result = await teamMethods.createGroup('testteam_teamMethods', user.id)
      await Team.destroy({
        where: {
          teamName: 'testteam_teamMethods'
        }
      })
      await User.destroy({
        where: {
          userName: 'testname_teamMethods',
          password: 'testpassword_teamMethods',
          email: 'testemail_teamMethods'
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
      const user = await User.create({ userName: 'testname_teamMethods', password: 'testpassword_teamMethods', email: 'testemail_teamMethods' })
      const result = await teamMethods.createGroup('hello', user.id, 2)
      await User.destroy({
        where: {
          userName: 'testname_teamMethods',
          password: 'testpassword_teamMethods',
          email: 'testemail_teamMethods'
        }
      })
      expect(result).toEqual('TEAM_NOT_FOUND')
    })
    test('if Conference created,return Created', async () => {
      const user = await User.create({ userName: 'testname_teamMethods', password: 'testpassword_teamMethods', email: 'testemail_teamMethods' })
      await teamMethods.createGroup('testteam_teamMethods', user.id)
      const team = await Team.findAll({ where: { teamName: 'testteam_teamMethods', founderID: user.id } })
      const result = await teamMethods.createGroup('hello', user.id, team[0].id)
      await Conference.destroy({ where: { conferenceName: 'hello', founderID: user.id, teamID: team[0].id } })
      await Team.destroy({
        where: {
          teamName: 'testteam_teamMethods'
        }
      })
      await User.destroy({
        where: {
          userName: 'testname_teamMethods',
          password: 'testpassword_teamMethods',
          email: 'testemail_teamMethods'
        }
      })
      expect(result).toEqual('CREATED')
    })
  })
})
