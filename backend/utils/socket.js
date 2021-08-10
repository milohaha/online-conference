const noticeMethods = require('../methods/notice')
const publicMethods = require('../methods/public')
const { models } = require('./database')
const constant = require('./constant')
const { NOT_READ, NOT_SOLVED, ACCEPTED, REJECTED, IS_TEAM, IS_CONFERENCE, LEAVE, ALREADY_READ } = require('../utils/constant')
// for video channel
const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const appID = 'a72e28c547214bb7a8c03c136be2ff11'
const appCertificate = 'c3927ee9482243b1ad766cfcea4da3f9'

const sendUniqueNotice = async function (toWhom, title, content) {
  const noticeID = await noticeMethods.storeNotice({ title: title, content: content })
  await noticeMethods.storeUserNotice({ userID: toWhom, noticeID: noticeID, hasRead: NOT_READ })
  const toSocket = noticeMethods.findOnlineSocket(toWhom)
  if (toSocket) {
    toSocket.emit('noticeEvent')
  }
}

const broadcastGroupNotice = async function (conferenceOrTeam, conferenceOrTeamID, title, content) {
  const toWhoms = await publicMethods.findGroupUserIDs(conferenceOrTeam, conferenceOrTeamID)
  if (toWhoms && toWhoms.length !== 0) {
    for (const toWhom of toWhoms) {
      sendUniqueNotice(toWhom, title, content)
    }
  }
}

const verificationHandler = async function (acceptOrReject, userID, verificationID) {
  try {
    const title = '系统通知'
    const userName = await publicMethods.getNameByID(models.User, userID)
    let content
    // 给发出邀请/申请的人发消息
    const solvedVerification = await models.Verification.findAll({
      where: {
        id: verificationID
      }
    })
    if (solvedVerification && solvedVerification.length !== 0) {
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
    const result = await publicMethods.getObjects(models.UserTeam, { userID: newMemberID, teamID: solvedVerification[0].teamID })
    if (!(result && result.length !== 0)) {
      await models.UserTeam.create({ userID: newMemberID, teamID: solvedVerification[0].teamID })
    }
  } catch (error) {
    console.log(error)
  }
}

const leaveGroupHandler = async function (userID, removedOrLeave, conferenceOrTeam, conferenceOrTeamID) {
  const title = '系统通知'
  const groupType = conferenceOrTeam === IS_TEAM ? '团队' : '会议室'
  let content, receiverID, founderID, groupName, userName
  const group = await publicMethods.findGroup(conferenceOrTeam, conferenceOrTeamID)
  if (group && group.length !== 0) {
    founderID = group[0].founderID
    groupName = conferenceOrTeam === IS_TEAM ? group[0].teamName : group[0].conferenceName
    // 成员主动退出，需通知会议室/团队创建者
    if (removedOrLeave === LEAVE) {
      receiverID = founderID
      userName = await publicMethods.getNameByID(models.User, userID)
      content = userName + '已退出' + groupType + ':' + groupName
    } else {
      receiverID = userID
      content = '您已被移出' + groupType + ':' + groupName
    }
    if (receiverID) {
      sendUniqueNotice(receiverID, title, content)
    }
  }
  // 把用户从相应的表中删除
  try {
    if (conferenceOrTeam === IS_TEAM) {
      await models.UserTeam.destroy({
        where: {
          userID: userID,
          teamID: conferenceOrTeamID
        }
      })
    } else if (conferenceOrTeam === IS_CONFERENCE) {
      await models.UserConference.destroy({
        where: {
          userID: userID,
          conferenceID: conferenceOrTeamID
        }
      })
      await models.ActiveUserConference.destroy({
        where: {
          userID: userID,
          conferenceID: conferenceOrTeamID
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const dismissHandler = async function (conferenceOrTeam, conferenceOrTeamID) {
  const group = await publicMethods.findGroup(conferenceOrTeam, conferenceOrTeamID)
  if (group && group.length !== 0) {
    const groupName = conferenceOrTeam === IS_TEAM ? group[0].teamName : group[0].conferenceName
    const title = '系统通知'
    const content = groupName + '已被解散'
    broadcastGroupNotice(conferenceOrTeam, conferenceOrTeamID, title, content)
  }
  try {
    if (conferenceOrTeam === IS_TEAM) {
      await models.Team.destroy({
        where: {
          id: conferenceOrTeamID
        }
      })
      await models.UserTeam.destroy({
        where: {
          teamID: conferenceOrTeamID
        }
      })
    } else if (conferenceOrTeam === IS_CONFERENCE) {
      await models.Conference.destroy({
        where: {
          id: conferenceOrTeamID
        }
      })
      await models.UserConference.destroy({
        where: {
          conferenceID: conferenceOrTeamID
        }
      })
      await models.ActiveUserConference.destroy({
        where: {
          conferenceID: conferenceOrTeamID
        }
      })
      await models.ConferenceBoard.destroy({
        where: {
          conferenceID: conferenceOrTeamID
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const sendVerification = async function (senderID, receiverIDs, teamID, type) {
  for (const receiverID of receiverIDs) {
    const verificationID = await noticeMethods.storeVerification({ type: type, senderID: senderID, receiverID: receiverID, teamID: teamID })
    await noticeMethods.storeUserVerification({ userID: receiverID, verificationID: verificationID, hasSolved: NOT_SOLVED })
    const toSocket = noticeMethods.findOnlineSocket(receiverID)
    if (toSocket) {
      toSocket.emit('verificationEvent')
    }
  }
}

const readNotice = async function (userID, noticeID) {
  await models.UserNotice.update(
    { hasRead: ALREADY_READ },
    {
      where: {
        userID: userID,
        noticeID: noticeID
      }
    }
  )
}

const enterConference = async function (userID, conferenceID) {
  const object = await models.ActiveUserConference.findOne({ where: { userID: userID, conferenceID: conferenceID } })
  if (!object) {
    await models.ActiveUserConference.create({
      userID: userID,
      conferenceID: conferenceID
    })
  }
}

const exitConference = async function (userID, conferenceID) {
  await models.ActiveUserConference.destroy({
    where: {
      userID: userID,
      conferenceID: conferenceID
    }
  })
}

module.exports = function (server) {
  const io = require('socket.io')(server, { transports: ['websocket'] })
  const EditorSocketIOServer = require('../ot/editor-socketio-server.js')
  const editorServers = new Map()

  io.on('connection', (socket) => {
    console.log('userConnected')

    // 新建文档同步
    socket.on('newDocumentBlock', (params) => {
      models.ConferenceBlock.create({
        conferenceID: params.conferenceID,
        itemID: params.docID,
        type: params.type,
        itemLeft: params.left,
        itemTop: params.top,
        language: params.language
      })
      socket.to('conference' + params.conferenceID).emit('newDocumentBlock', { type: params.type, docID: params.docID, left: params.left, top: params.top, language: params.language })
    })

    socket.on('enterDocumentBlock', async (docID) => {
      const block = await models.ConferenceBlock.findOne({ where: { itemID: docID } })
      let contents = Object.getOwnPropertyDescriptors(block).dataValues.value.contents
      if (!contents) {
        contents = ''
      }
      let editorServer = editorServers.get(docID)
      if (!editorServer) {
        editorServer = new EditorSocketIOServer(contents, [], docID)
        editorServers.set(docID, editorServer)
      }
      editorServer.addClient(socket)
    })

    // 移动文档同步
    socket.on('moveDocumentBlock', (params) => {
      socket.to('conference' + params.conferenceID).emit('moveDocumentBlock', { left: params.left, top: params.top, docID: params.docID })
    })

    // 移动文档停止
    socket.on('dragBlockStop', (params) => {
      models.ConferenceBlock.update({
        itemLeft: params.left,
        itemTop: params.top
      }, {
        where: {
          itemID: params.docID
        }
      })
    })

    // 删除文档同步
    socket.on('deleteDocumentBlock', (params) => {
      socket.to('conference' + params.conferenceID).emit('deleteDocumentBlock', params.docID)
      models.ConferenceBlock.destroy({
        where: {
          itemID: params.docID,
          conferenceID: params.conferenceID
        }
      })
    })

    // 上传文件同步
    socket.on('newPdfFile', (params) => {
      socket.to('conference' + params.conferenceID).emit('newPdfFile', { fileContent: params.fileContent, fileID: params.fileID })
      models.ConferenceFile.create({
        conferenceID: params.conferenceID,
        fileID: params.fileID,
        fileContent: params.fileContent,
        fileLeft: 0,
        fileTop: 0
      })
    })

    // 移动文件
    socket.on('moveFile', (params) => {
      socket.to('conference' + params.conferenceID).emit('moveFile', { left: params.left, top: params.top, fileID: params.fileID })
    })

    socket.on('dragFileStop', (params) => {
      models.ConferenceFile.update({
        fileLeft: params.left,
        fileTop: params.top
      }, {
        where: {
          fileID: params.fileID
        }
      })
    })

    // 删除PDF文件
    socket.on('removeFile', (params) => {
      socket.to('conference' + params.conferenceID).emit('removeFile', params.fileID)
      models.ConferenceFile.destroy({
        where: {
          conferenceID: params.conferenceID,
          fileID: params.fileID
        }
      })
    })

    socket.on('login', function (userID) {
      noticeMethods.storeOnlineUsers(userID, socket)
    })

    socket.on('enterConference', enterConference)

    socket.on('exitConference', exitConference)

    socket.on('rejectNotice', rejectGroupHandler)

    socket.on('acceptNotice', acceptGroupHandler)

    socket.on('leaveNotice', leaveGroupHandler)

    socket.on('dismissNotice', dismissHandler)

    socket.on('sendVerification', sendVerification)

    socket.on('readNotice', readNotice)

    socket.on('sendObjectOfCanvas', (object, conferenceID, uuid, setOption) => {
      io.to('conference' + conferenceID).emit('receiveObjectOfCanvas', object, uuid, setOption)
      if (object.state === 'removed') {
        models.ConferenceBoard.destroy({
          where: {
            conferenceID: conferenceID,
            itemID: object.id
          }
        })
        return
      }
      if (setOption !== undefined && setOption !== null) {
        Object.keys(setOption).forEach(key => {
          object[key] = setOption[key]
        })
      }
      publicMethods.createOrUpdateObject(models.ConferenceBoard, {
        conferenceID: conferenceID,
        itemID: object.id
      }, { itemDetails: JSON.stringify(object) })
    })

    socket.on('logout', function (userID) {
      noticeMethods.deleteOnlineSocket(userID)
    })

    socket.on('enterCanvas', async (conferenceID) => {
      socket.join('conference' + conferenceID)
      const objects = await publicMethods.getObjects(models.ConferenceBoard, { conferenceID: conferenceID })
      const itemsOfCanvas = objects.map(object => { return Object.getOwnPropertyDescriptors(object).dataValues.value.itemDetails })
      const blocks = await publicMethods.getObjects(models.ConferenceBlock, { conferenceID: conferenceID })
      const blocksOfCanvas = blocks.map(block => { return Object.getOwnPropertyDescriptors(block).dataValues.value })
      const files = await publicMethods.getObjects(models.ConferenceFile, { conferenceID: conferenceID })
      const filesOfCanvas = files.map(file => { return Object.getOwnPropertyDescriptors(file).dataValues.value })
      socket.emit('initCanvas', itemsOfCanvas, blocksOfCanvas, filesOfCanvas)
    })

    socket.on('enterVideo', async (userID, conferenceID) => {
      const channelName = 'Conference' + conferenceID
      const role = RtcRole.PUBLISHER
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const privilegeExpiredTs = currentTimestamp + constant.EXPIRED
      const videoToken = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, userID, role, privilegeExpiredTs)
      socket.emit('initVideo', videoToken)
    })

    socket.on('disconnect', () => {
      console.log('userDisconnected')
    })
  })
}
