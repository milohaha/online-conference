const teamMethods = require('../methods/team')
const database = require('../db/models/index')
const sequelize = database.sequelize
const Team = sequelize.models.Team
const User = sequelize.models.User

describe('createTeam', () => {
  test('no paras should return TeamName Error', async () => {
    const result = await teamMethods.createTeam()
    expect(result).toBe('TEAMNAME_ERROR')
  })
  test('one paras should return User Error', async () => {
    const result = await teamMethods.createTeam('name')
    expect(result).toBe('USER_ERROR')
  })
  test('if team created, return created', async () => {
    const user = await User.create({ username: 'testname', password: 'testpassword', email: 'testemail' })
    const result = await teamMethods.createTeam('testteam', user.id)
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
    const result = await teamMethods.createTeam('team', -2)
    expect(result).toBe('FOUNDERID_ERROR')
  })
})
