const { models } = require('../utils/database')
const socketMap = new Map()
const { NOT_READ, NOT_SOLVED } = require('../utils/constant')
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
  },
  getNoticeOrVerification: async function (type, userID) {
    let objects, result
    const results = []
    if (type === 'notice') {
      objects = await this.getObjetcs(models.UserNotice, {
        userID: userID,
        hasRead: NOT_READ
      })
      for (const object of objects) {
        result = await this.getObjetcs(models.Notice, {
          id: object.noticeID
        })
        if (result && result.length !== 0) {
          results.push(result[0])
        }
      }
    } else if (type === 'verification') {
      objects = await this.getObjetcs(models.UserVerification, {
        userID: userID,
        hasSolved: NOT_SOLVED
      })
      for (const object of objects) {
        result = await this.getObjetcs(models.Verification, {
          id: object.verificationID
        })
        if (result && result.length !== 0) {
          results.push(result[0])
        }
      }
    }
    return results
  }
}
