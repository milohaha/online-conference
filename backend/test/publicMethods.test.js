const publicMethods = require('../methods/public')
const { IS_TEAM, IS_CONFERENCE } = require('../utils/constant')
const { models } = require('../utils/database')
const User = models.User
const Team = models.Team
const Conference = models.Conference
const UserTeam = models.UserTeam
const UserConference = models.UserConference

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
  test('zero paras should return []', async () => {
    const object = await publicMethods.getObjects()
    expect(object).toEqual([])
  })
  test('one paras should return []', async () => {
    const objects = await publicMethods.getObjects(User)
    expect(objects).toEqual([])
  })
  test('paras type error should return []', async () => {
    const objects = await publicMethods.getObjects(User, 'name')
    expect(objects).toEqual([])
  })
  test('find one object ', async () => {
    await User.create({
      userName: 'testname_publicMethods',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
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
    await User.create({
      userName: 'testname1_getObjects',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    await User.create({
      userName: 'testname2_getObjects',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const objects = await publicMethods.getObjects(User, { userName: 'testname1_getObjects' })
    const expectedResults = await User.findAll({
      where: { userName: 'testname1_getObjects' }
    })
    await User.destroy({
      where: {
        userName: 'testname1_getObjects',
        password: 'testpassword_publicMethods',
        email: 'testemail_publicMethods'
      }
    })
    await User.destroy({
      where: {
        userName: 'testname2_getObjects',
        password: 'testpassword_publicMethods',
        email: 'testemail_publicMethods'
      }
    })
    expect(objects).toEqual(expectedResults)
  })
})

describe('getObjectID', () => {
  test('find objectID that exists', async () => {
    await User.create({
      userName: 'testname_getObjectID',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const actualID = await publicMethods.getObjectID(User, { userName: 'testname_getObjectID' })
    const expectedObject = await User.findAll({
      where: {
        userName: 'testname_getObjectID'
      }
    })
    await User.destroy({
      where: {
        userName: 'testname_getObjectID',
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

describe('getNameByID', () => {
  test('missing parameters should return ""', async () => {
    const result = await publicMethods.getNameByID()
    expect(result).toBe('')
  })
  test('get a name of a invalid models', async () => {
    const result = await publicMethods.getNameByID(UserTeam, 1)
    expect(result).toBe('')
  })
  test('get a existing userName by his/her id', async () => {
    const user = await User.create({
      userName: 'testname_getNameByID',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const result = await publicMethods.getNameByID(User, user.id)
    await User.destroy({
      where: {
        userName: 'testname_getNameByID'
      }
    })
    expect(result).toBe('testname_getNameByID')
  })
  test('get a userName by a non-existing id', async () => {
    const result = await publicMethods.getNameByID(User, 0)
    expect(result).toBe('')
  })
  test('get a existing TeamName by its id', async () => {
    const user = await User.create({
      userName: 'testname2_getNameByID',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const team = await Team.create({ teamName: 'testname2_getNameByID', founderID: user.id })
    const result = await publicMethods.getNameByID(Team, team.id)
    await User.destroy({
      where: {
        userName: 'testname2_getNameByID'
      }
    })
    await Team.destroy({
      where: {
        teamName: 'testname2_getNameByID'
      }
    })
    expect(result).toBe('testname2_getNameByID')
  })
  test('get a existing conferenceName by its id', async () => {
    const user = await User.create({
      userName: 'testname3_getNameByID',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const team = await Team.create({ teamName: 'testname3_getNameByID', founderID: user.id })
    const conference = await Conference.create({
      conferenceName: 'testname3_getNameByID',
      founderID: user.id,
      teamID: team.id
    })
    const result = await publicMethods.getNameByID(Conference, conference.id)
    await User.destroy({
      where: {
        userName: 'testname3_getNameByID'
      }
    })
    await Team.destroy({
      where: {
        teamName: 'testname3_getNameByID'
      }
    })
    await Conference.destroy({
      where: {
        conferenceName: 'testname3_getNameByID'
      }
    })
    expect(result).toBe('testname3_getNameByID')
  })
})

describe('findGroup', () => {
  test('missing parameters should return []', async () => {
    const result = await publicMethods.findGroup()
    expect(result).toEqual([])
  })
  test('false parameter should return []', async () => {
    const result = await publicMethods.findGroup(3, 1)
    expect(result).toEqual([])
  })
  test('find a existing team', async () => {
    const user = await User.create({
      userName: 'testname_findGroup',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const team = await Team.create({ teamName: 'testname_findGroup', founderID: user.id })
    const result = await publicMethods.findGroup(IS_TEAM, team.id)
    const expectedResults = await Team.findAll({
      where: { teamName: 'testname_findGroup' }
    })
    await User.destroy({
      where: {
        userName: 'testname_findGroup'
      }
    })
    await Team.destroy({
      where: {
        teamName: 'testname_findGroup'
      }
    })
    expect(result).toEqual(expectedResults)
  })
  test('find a existing conference', async () => {
    const user = await User.create({
      userName: 'testname2_findGroup',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const team = await Team.create({ teamName: 'testname2_findGroup', founderID: user.id })
    const conference = await Conference.create({
      conferenceName: 'testname2_findGroup',
      founderID: user.id,
      teamID: team.id
    })
    const result = await publicMethods.findGroup(IS_CONFERENCE, conference.id)
    const expectedResults = await Conference.findAll({
      where: { conferenceName: 'testname2_findGroup' }
    })
    await User.destroy({
      where: {
        userName: 'testname2_findGroup'
      }
    })
    await Team.destroy({
      where: {
        teamName: 'testname2_findGroup'
      }
    })
    await Conference.destroy({
      where: {
        conferenceName: 'testname2_findGroup'
      }
    })
    expect(result).toEqual(expectedResults)
  })
})

describe('findGroupUserIDs', () => {
  test('missing parameters should return []', async () => {
    const result = await publicMethods.findGroupUserIDs()
    expect(result).toEqual([])
  })
  test('false parameter should return []', async () => {
    const result = await publicMethods.findGroupUserIDs(3, 1)
    expect(result).toEqual([])
  })
  test('find ids of team members of a non-existing group', async () => {
    const result = await publicMethods.findGroupUserIDs(2, 1)
    expect(result).toEqual([])
  })
  test('find ids of team members', async () => {
    const user = await User.create({
      userName: 'testname_findGroupUserIDs',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const team = await Team.create({ teamName: 'testname_findGroupUserIDs', founderID: user.id })
    await UserTeam.create({ userID: user.id, teamID: team.id })
    const result = await publicMethods.findGroupUserIDs(IS_TEAM, team.id)
    await User.destroy({
      where: {
        userName: 'testname_findGroupUserIDs'
      }
    })
    await Team.destroy({
      where: {
        teamName: 'testname_findGroupUserIDs'
      }
    })
    await UserTeam.destroy({
      where: {
        userID: user.id,
        teamID: team.id
      }
    })
    expect(result).toEqual([user.id])
  })
  test('find ids of conference members', async () => {
    const user = await User.create({
      userName: 'testname2_findGroupUserIDs',
      password: 'testpassword_publicMethods',
      email: 'testemail_publicMethods'
    })
    const team = await Team.create({
      teamName: 'testname2_findGroupUserIDs',
      founderID: user.id
    })
    const conference = await Conference.create({
      conferenceName: 'testname2_findGroupUserIDs',
      founderID: user.id,
      teamID: team.id
    })
    await UserConference.create({ userID: user.id, conferenceID: conference.id })
    const result = await publicMethods.findGroupUserIDs(IS_CONFERENCE, conference.id)
    await User.destroy({
      where: {
        userName: 'testname2_findGroupUserIDs'
      }
    })
    await Conference.destroy({
      where: {
        conferenceName: 'testname2_findGroupUserIDs'
      }
    })
    await UserConference.destroy({
      where: {
        userID: user.id,
        conferenceID: conference.id
      }
    })
    expect(result).toEqual([user.id])
  })
})
