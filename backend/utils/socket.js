const noticeMethods = require('../methods/notice')
const userMethods = require('../methods/user')
const { NOT_READ, NOT_SOLVED } = require('../utils/constant')

const verificationHandler = function (fromWhom, toWhom, conferenceOrTeamID, requestType) {
  const verificationID = noticeMethods.storeVerification({ type: requestType, applicantID: fromWhom, conferenceOrTeamID: conferenceOrTeamID })
  noticeMethods.storeUserVerification({ userID: toWhom, verificationID: verificationID, hasSolved: NOT_SOLVED })
  const toSocket = noticeMethods.findOnlineSocket(toWhom)
  if (toSocket) {
    toSocket.emit('verificationEvent')
  }
}

const uniqueNoticeHandler = function (toWhom, title, content) {
  const noticeID = noticeMethods.storeNotice({ title: title, content: content })
  noticeMethods.storeUserNotice({ userID: toWhom, noticeID: noticeID, hasRead: NOT_READ })
  const toSocket = noticeMethods.findOnlineSocket(toWhom)
  if (toSocket) {
    toSocket.emit('NoticeEvent')
  }
}

const groupNoticeHandler = function (conferenceOrTeam, conferenceOrTeamID, title, content) {
  const noticeID = noticeMethods.storeNotice({ title: title, content: content })
  const toWhoms = userMethods.findGroupUserIds(conferenceOrTeam, conferenceOrTeamID)
  for (const toWhom in toWhoms) {
    noticeMethods.storeUserNotice({ userID: toWhom, noticeID: noticeID, hasRead: NOT_READ })
  }
  const toSockets = noticeMethods.findGroupOnlineSockets(toWhoms)
  if (toWhoms && toWhoms.length !== 0) {
    for (const toSocket in toSockets) {
      if (toSocket) {
        toSocket.emit('noticeEvent')
      }
    }
  }
}

module.exports = function (server) {
  const io = require('socket.io')(server, { transports: ['websocket'] })

  io.on('connection', (socket) => {
    console.log('connected')

    socket.on('login', function (userID) {
      noticeMethods.storeOnlineUsers(userID, socket)
    })

    socket.on('verificationEvent', verificationHandler)

    socket.on('uniqueNoticeEvent', uniqueNoticeHandler)

    socket.on('groupNoticeEvent', groupNoticeHandler)

    socket.on('logout', function (userID) {
      noticeMethods.deleteOnlineSocket(userID)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })
  })
}
