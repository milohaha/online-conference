const publicMethods = require('../methods/public')
const { models } = require('../utils/database')
const User = models.User

describe('sha512', () => {
  test('no paras should return cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"', () => {
    expect(publicMethods.sha512()).toBe('cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e')
  })
  test('"hello" should return 9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043', () => {
    expect(publicMethods.sha512('hello')).toBe('9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043')
  })
  test('" " should return f90ddd77e400dfe6a3fcf479b00b1ee29e7015c5bb8cd70f5f15b4886cc339275ff553fc8a053f8ddc7324f45168cffaf81f8c3ac93996f6536eef38e5e40768', () => {
    expect(publicMethods.sha512(' ')).toBe('f90ddd77e400dfe6a3fcf479b00b1ee29e7015c5bb8cd70f5f15b4886cc339275ff553fc8a053f8ddc7324f45168cffaf81f8c3ac93996f6536eef38e5e40768')
  })
})

describe('checkString', () => {
  test('no paras should return false', () => {
    expect(publicMethods.checkString()).toBe(false)
  })
  test('"hello" should be a string', () => {
    expect(publicMethods.checkString('hello')).toBe(true)
  })
  test('"" should not be a string', () => {
    expect(publicMethods.checkString('')).toBe(false)
  })
})

describe('getObjects', () => {
  test('zero paras should return {}', async () => {
    const object = await publicMethods.getObjects()
    expect(object).toEqual({})
  })
  test('one paras should return {}', async () => {
    const objects = await publicMethods.getObjects(User)
    expect(objects).toEqual({})
  })
  test('paras type error should return {}', async () => {
    const objects = await publicMethods.getObjects(User, 'name')
    expect(objects).toEqual({})
  })
  test('find one object ', async () => {
    await User.create({ userName: 'testname_publicMethods', password: 'testpassword_publicMethods', email: 'testemail_publicMethods' })
    const objects = await publicMethods.getObjects(User, { userName: 'testname_publicMethods' })
    const expectResult = await User.findAll({
      where: { userName: 'testname_publicMethods' }
    })
    await User.destroy({
      where: {
        userName: 'testname_publicMethods',
        password: 'testpassword_publicMethods',
        email: 'testemail_publicMethods'
      }
    })
    expect(objects).toEqual(expectResult)
  })
  test('find many objects ', async () => {
    await User.create({ userName: 'testname_publicMethods', password: 'testpassword_publicMethods', email: 'testemail_publicMethods' })
    await User.create({ userName: 'testname2_publicMethods', password: 'testpassword_publicMethods', email: 'testemail_publicMethods' })
    const objects = await publicMethods.getObjects(User, { userName: 'testname_publicMethods' })
    expect(objects).toEqual(await User.findAll({
      where: { userName: 'testname_publicMethods' }
    }))
    await User.destroy({
      where: {
        userName: 'testname_publicMethods',
        password: 'testpassword_publicMethods',
        email: 'testemail_publicMethods'
      }
    })
    await User.destroy({
      where: {
        userName: 'testname2_publicMethods',
        password: 'testpassword_publicMethods',
        email: 'testemail_publicMethods'
      }
    })
  })
})

describe('getObjectID', () => {
  test('find objectID that exists', async () => {
    await User.create({ userName: 'testname_publicMethods', password: 'testpassword_publicMethods', email: 'testemail_publicMethods' })
    const actualID = await publicMethods.getObjectID(User, { userName: 'testname_publicMethods' })
    const expectedObject = await User.findAll({
      where: {
        userName: 'testname_publicMethods'
      }
    })
    await User.destroy({
      where: {
        userName: 'testname_publicMethods',
        password: 'testpassword_publicMethods',
        email: 'testemail_publicMethods'
      }
    })
    expect(actualID).toBe(expectedObject[0].id)
  })
  test('no condition paras should return ""', async () => {
    const actualID = await publicMethods.getObjectID(User)
    expect(actualID).toBe('')
  })
  test('no Model para should return ""', async () => {
    const actualID = await publicMethods.getObjectID({ userName: 'testname_publicMethods' })
    expect(actualID).toBe('')
  })
  test('find objectID that doesnt exist', async () => {
    const actualID = await publicMethods.getObjectID(User, { userName: 'dontExistName_publicMethods' })
    expect(actualID).toBe('')
  })
})
