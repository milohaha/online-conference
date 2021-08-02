const noticeMethods = require('../methods/notice')
const { models } = require('../utils/database')
const { NOT_READ } = require('../utils/constant')
describe('storeVerification', () => {
  test('Normal return', async () => {
    const user = await models.User.create({ userName: 'name_storeVerification_noticeMethods', password: 'password_storeVerification_noticeMethods', email: 'name_storeVerification_noticeMethods' })
    const user2 = await models.User.create({ userName: 'name2_storeVerification_noticeMethods', password: 'password_storeVerification_noticeMethods', email: 'name_storeVerification_noticeMethods' })
    const team = await models.Team.create({ teamName: 'teamName_storeVerification_noticeMethods', founderID: user.id })
    const id = await noticeMethods.storeVerification({ type: 'invitation', senderID: user.id, receiverID: user2.id, teamID: team.id })
    await noticeMethods.storeUserVerification({ userID: user2.id, verificationID: id, hasSolved: NOT_READ })
    const resultVerification = await models.Verification.findAll({
      where: {
        type: 'invitation', senderID: user.id, receiverID: user2.id, teamID: team.id
      }
    })
    const resultUserVerification = await models.UserVerification.findAll({
      where: {
        userID: user2.id, verificationID: id, hasSolved: NOT_READ
      }
    })
    const resultGet = await noticeMethods.getNoticeOrVerification('verification', user2.id)
    await models.UserVerification.destroy({
      where: { userID: user2.id, verificationID: id, hasSolved: NOT_READ }
    })
    await models.Verification.destroy({
      where: { type: 'invitation', senderID: user.id, receiverID: user2.id, teamID: team.id }
    })
    await models.Team.destroy({
      where: { teamName: 'teamName_storeVerification_noticeMethods', founderID: user.id }
    })
    await models.User.destroy({
      where: { userName: 'name_storeVerification_noticeMethods', password: 'password_storeVerification_noticeMethods', email: 'name_storeVerification_noticeMethods' }
    })
    await models.User.destroy({
      where: { userName: 'name2_storeVerification_noticeMethods', password: 'password_storeVerification_noticeMethods', email: 'name_storeVerification_noticeMethods' }
    })
    expect(resultVerification).toHaveLength(1)
    expect(resultUserVerification).toHaveLength(1)
    expect(resultGet).toHaveLength(1)
  })
})
describe('storeNotice', () => {
  test('Normal return', async () => {
    const user = await models.User.create({ userName: 'name_storeNotice_noticeMethods', password: 'password_storeNotice_noticeMethods', email: 'name_storeNotice_noticeMethods' })
    const user2 = await models.User.create({ userName: 'name2_storeNotice_noticeMethods', password: 'password_storeNotice_noticeMethods', email: 'name_storeNotice_noticeMethods' })
    const id = await noticeMethods.storeNotice({ title: 'title_storeNotice_noticeMethods', content: 'contend_storeNotice_noticeMethods' })
    await noticeMethods.storeUserNotice({ userID: user2.id, noticeID: id, hasRead: NOT_READ })
    const resultNotice = await models.Notice.findAll({
      where: {
        title: 'title_storeNotice_noticeMethods', content: 'contend_storeNotice_noticeMethods'
      }
    })
    const resultUserNotice = await models.UserNotice.findAll({
      where: {
        userID: user2.id, noticeID: id, hasRead: NOT_READ
      }
    })
    const resultGet = await noticeMethods.getNoticeOrVerification('notice', user2.id)
    await models.UserNotice.destroy({
      where: { userID: user2.id, noticeID: id, hasRead: NOT_READ }
    })
    await models.Notice.destroy({
      where: { title: 'title_storeNotice_noticeMethods', content: 'contend_storeNotice_noticeMethods' }
    })
    await models.Team.destroy({
      where: { teamName: 'teamName_storeNotice_noticeMethods', founderID: user.id }
    })
    await models.User.destroy({
      where: { userName: 'name_storeNotice_noticeMethods', password: 'password_storeNotice_noticeMethods', email: 'name_storeNotice_noticeMethods' }
    })
    await models.User.destroy({
      where: { userName: 'name2_storeNotice_noticeMethods', password: 'password_storeNotice_noticeMethods', email: 'name_storeNotice_noticeMethods' }
    })
    expect(resultNotice).toHaveLength(1)
    expect(resultUserNotice).toHaveLength(1)
    expect(resultGet).toHaveLength(1)
  })
})
