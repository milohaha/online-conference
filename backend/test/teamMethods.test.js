const teamMethods = require('../methods/team')
const database = require('../db/models/index')
const sequelize = database.sequelize
const Team = sequelize.models.Team
const User = sequelize.models.User
test('no paras should return TeamName Error', async () => {
  const result = await teamMethods.createTeam()
  expect(result).toBe('TeamName Error')
})
test('one paras should return User Error', async () => {
  const result = await teamMethods.createTeam('name')
  expect(result).toBe('User Error')
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
  expect(result).toBe('created')
})
test('if user doesnt exist, return FounderId Error', async () => {
  const result = await teamMethods.createTeam('team', -2)
  expect(result).toBe('FounderId Error')
})
