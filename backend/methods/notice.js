const database = require('../db/models')
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
  findGroupOnlineSockets: function (userIDs) {
    const sockets = []
    for (const userID in userIDs) {
      sockets.push(socketMap.get(userID))
    }
  },
  storeVerification: async function (verification) {
    await models.Verifications.create({
      type: verification.type,
      applicantID: verification.applicantID,
      conferenceOrTeamID: verification.conferenceOrTeamID
    })
  },
  storeUserVerification: async function (userVerification) {
    await models.UserVerification.create({
      userID: userVerification.userID,
      verificationID: userVerification.verificationID,
      hasSolved: userVerification.hasSolved
    })
  },
  storeNotice: async function (notice) {
    await models.Notice.create({
      title: notice.title,
      content: notice.content
    })
  },
  storeUserNotice: async function (userNotice) {
    await models.UserNotice.create({
      userID: userNotice.userID,
      noticeID: userNotice.noticeID,
      hasRead: userNotice.hasRead
    })
  }
}
