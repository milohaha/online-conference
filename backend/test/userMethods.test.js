const userMethods = require('../methods/user')
const { models } = require('../utils/database')
const User = models.User

test('zero paras return Username Error', async () => {
  const result = await userMethods.createUser()
  expect(result).toBe('USERNAME_ERROR')
})
test('one paras return Password Error', async () => {
  const result = await userMethods.createUser('name_userMethods')
  expect(result).toBe('PASSWORD_ERROR')
})
test('two paras return Email Error', async () => {
  const result = await userMethods.createUser('name_userMethods', 'password_userMethods')
  expect(result).toBe('EMAIL_ERROR')
})
test('if user has been created return USER_EXIST', async () => {
  await User.create({
    userName: 'name_userMethods',
    password: 'password_userMethods',
    email: 'email_userMethods'
  })
  const result = await userMethods.createUser('name_userMethods', 'password_userMethods', 'email_userMethods')
  await User.destroy({
    where: {
      userName: 'name_userMethods',
      password: 'password_userMethods',
      email: 'email_userMethods'
    }
  })
  expect(result).toBe('USER_EXIST')
})
test('if user created return USER_REGISTER', async () => {
  const result = await userMethods.createUser('name_userMethods', 'password_userMethods', 'email_userMethods')
  await User.destroy({
    where: {
      userName: 'name_userMethods',
      password: 'password_userMethods',
      email: 'email_userMethods'
    }
  })
  expect(result).toBe('USER_REGISTER')
})
