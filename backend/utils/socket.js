const noticeMethods = require('../methods/notice')
const publicMethods = require('../methods/public')
const database = require('../db/models/index')
const models = database.sequelize.models
const { NOT_READ, ACCEPTED, REJECTED } = require('../utils/constant')

const sendUniqueNotice = function (toWhom, title, content) {
  const noticeID = noticeMethods.storeNotice({ title: title, content: content })
  noticeMethods.storeUserNotice({ userID: toWhom, noticeID: noticeID, hasRead: NOT_READ })
  const toSocket = noticeMethods.findOnlineSocket(toWhom)
  if (toSocket) {
    toSocket.emit('noticeEvent')
  }
}

const verificationHandler = async function (acceptOrReject, userID, verificationID) {
  try {
    const user = await publicMethods.getObjects(models.User, { id: userID })
    const title = '系统通知'
    let content
    // 给发出邀请/申请的人发消息
    const solvedVerification = await models.Verification.findAll({
      where: {
        id: verificationID
      }
    })
    if (solvedVerification && solvedVerification.length !== 0 && user.length !== 0) {
      const userName = user[0].username
      const typeName = solvedVerification[0].type === 'invitation' ? '邀请' : '申请'
      const responseName = acceptOrReject === REJECTED ? '拒绝' : '同意'
      content = userName + responseName + '了您的' + typeName
      sendUniqueNotice(solvedVerification[0].senderID, title, content)
    }
    // 处理该用户的消息记录
    await models.UserVerification.update(
      { hasSolved: acceptOrReject },
      {
        where: { userID: userID, verificationID: verificationID }
      })
  } catch (error) {
    console.log(error)
  }
}

const rejectGroupHandler = async function (userID, verificationID) {
  await verificationHandler(REJECTED, userID, verificationID)
}

const acceptGroupHandler = async function (userID, verificationID) {
  try {
    await verificationHandler(ACCEPTED, userID, verificationID)
    // 存储团队新成员信息
    let newMemberID
    const solvedVerification = await models.Verification.findAll({
      where: {
        id: verificationID
      }
    })
    if (solvedVerification && solvedVerification.length !== 0) {
      if (solvedVerification[0].type === 'invitation') {
        newMemberID = solvedVerification[0].receiverID
      } else if (solvedVerification[0].type === 'application') {
        newMemberID = solvedVerification[0].senderID
      }
    }
    await models.UserTeam.create({ userID: newMemberID, teamID: solvedVerification[0].teamID })
  } catch (error) {
    console.log(error)
  }
}

module.exports = function (server) {
  const io = require('socket.io')(server, { transports: ['websocket'] })

  io.on('connection', (socket) => {
    console.log('connected')

    socket.on('login', function (userID) {
      noticeMethods.storeOnlineUsers(userID, socket)
    })

    socket.on('rejectNotice', rejectGroupHandler)

    socket.on('acceptNotice', acceptGroupHandler)

    socket.on('logout', function (userID) {
      noticeMethods.deleteOnlineSocket(userID)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })
  })
}
