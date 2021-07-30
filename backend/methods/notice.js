const database = require('../db/models/index')
const models = database.sequelize.models
const socketMap = new Map()
module.exports = {
  storeOnlineUsers: function (userID, socket) {
    socketMap.set(userID, socket)
  },
  deleteOnlineSocket: function (userID) {
    socketMap.delete(userID)
  },
  findOnlineSocket: function (userID) {
    return socketMap.get(userID)
  },
  storeVerification: async function (verification) {
    const newVerification = await models.Verifications.create({
      type: verification.type,
      applicantID: verification.applicantID,
      conferenceOrTeamID: verification.conferenceOrTeamID
    })
    return newVerification.id
  },
  storeUserVerification: async function (userVerification) {
    await models.UserVerification.create({
      userID: userVerification.userID,
      verificationID: userVerification.verificationID,
      hasSolved: userVerification.hasSolved
    })
  },
  storeNotice: async function (notice) {
    const newNotice = await models.Notice.create({
      title: notice.title,
      content: notice.content
    })
    return newNotice.id
  },
  storeUserNotice: async function (userNotice) {
    await models.UserNotice.create({
      userID: userNotice.userID,
      noticeID: userNotice.noticeID,
      hasRead: userNotice.hasRead
    })
  }
}
