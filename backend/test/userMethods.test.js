const userMethods = require('../methods/user')
const database = require('../db/models/index')
const sequelize = database.sequelize
const User = sequelize.models.User
test('zero paras return Username Error', async () => {
  const result = await userMethods.createUser()
  expect(result).toBe('Username Error')
})
test('one paras return Password Error', async () => {
  const result = await userMethods.createUser('name')
  expect(result).toBe('Password Error')
})
test('two paras return Email Error', async () => {
  const result = await userMethods.createUser('name', 'password')
  expect(result).toBe('Email Error')
})
test('if user has been created return USER_EXIST', async () => {
  await User.create({ username: 'name', password: 'password', email: 'email' })
  const result = await userMethods.createUser('name', 'password', 'email')
  await User.destroy({
    where: {
      username: 'name',
      password: 'password',
      email: 'email'
    }
  })
  expect(result).toBe('USER_EXIST')
})
test('if user created return USER_REGISTER', async () => {
  const result = await userMethods.createUser('name', 'password', 'email')
  await User.destroy({
    where: {
      username: 'name',
      password: 'password',
      email: 'email'
    }
  })
  expect(result).toBe('USER_REGISTER')
})
