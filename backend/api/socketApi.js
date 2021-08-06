/**
 * @api {socket} / rejectGroupHandler
 * @apiName rejectGroupHandler
 * @apiGroup Socket
 * @apiParam { Integer } userID 点击这条消息的用户的ID
 * @apiParam { Integer } verificationID 这条验证消息的ID
 * @apiDescription 监听到'rejectNotice'的处理函数，当用户点击验证消息的“拒绝”按钮时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('rejectNotice',userID, verificationID)
 */
/**
 * @api {socket} / acceptGroupHandler
 * @apiName acceptGroupHandler
 * @apiGroup Socket
 * @apiParam { Integer } userID 点击这条消息的用户的ID
 * @apiParam { Integer } verificationID 这条验证消息的ID
 * @apiDescription 监听到'acceptNotice'的处理函数，当用户点击验证消息的“同意”按钮时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('acceptNotice',userID, verificationID)
 */
/**
 * @api {socket} / leaveGroupHandler
 * @apiName leaveGroupHandler
 * @apiGroup Socket
 * @apiParam { Integer } userID 被移出的成员ID/离开的成员ID
 * @apiParam { Integer } removedOrLeave 表示被移出还是主动离开 REMOVED/LEAVE
 * @apiParam { Integer } conferenceOrTeam 表示是离开/被移出会议室还是团队：IS_CONFERENCE/IS_TEAM
 * @apiParam { Integer } conferenceOrTeamID
 * @apiDescription 监听到'leaveNotice'的处理函数，当用户离开/被移出会议室/团队时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('leaveNotice', userID, removedOrLeave, conferenceOrTeam, conferenceOrTeamID)
 */
/**
 * @api {socket} / dismissHandler
 * @apiName dismissHandler
 * @apiGroup Socket
 * @apiParam { Integer } conferenceOrTeam 表示是被解散的会议室还是团队 IS_CONFERENCE/IS_TEAM
 * @apiParam { Integer } conferenceOrTeamID 要解散的conference或team的ID
 * @description 监听到'dismissNotice'的处理函数，当会议室/团队被解散时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('dismissNotice', conferenceOrTeam, conferenceOrTeamID)
 */
/**
 * @api {socket} / sendVerification
 * @apiName sendVerification
 * @apiGroup Socket
 * @apiParam { Integer } senderID 发出邀请/申请的人的ID
 * @apiParam { Integer[] } receiverID 接收邀请/申请的人ID 注意：虽然接受申请的人只有一个，仍需写成数组形式
 * @apiParam { Integer } teamID 要进入的团队的ID
 * @apiParam { String } type 表示要发送的验证消息是邀请还是申请 'application' / 'invitation
 * @apiDescription 监听到'sendVerification'的处理函数，当团队成员要邀请新成员/用户申请进入团队时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('sendVerification', senderID, receiverIDs, teamID, type)
 */
/**
 * @api {socket} / readNotice
 * @apiName readNotice
 * @apiGroup Socket
 * @apiParam { Integer } userID
 * @apiParam { Integer } noticeID
 * @apiDescription 监听到'readNotice'的处理函数，当成员点击消息的“已读”按钮时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('readNotice', userID, noticeID)
 */
/**
 * @api {socket} / readNotice
 * @apiName readNotice
 * @apiGroup Socket
 * @apiParam { Integer } userID
 * @apiParam { Integer } noticeID
 * @apiDescription 监听到'readNotice'的处理函数，当成员点击消息的“已读”按钮时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('readNotice', userID, noticeID)
 */

/**
 * @api {socket} / enterConference
 * @apiName enterConference
 * @apiGroup Socket
 * @apiParam { Integer } userID 进入会议室的userID
 * @apiParam { Integer } conferenceID 进入的会议室的conferenceID
 * @apiDescription 监听到'enterConference'的处理函数，当用户进入会议室时调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('enterConference', userID, conferenceID)
 */

/**
 * @api {socket} / exitConference
 * @apiName exitConference
 * @apiGroup Socket
 * @apiParam { Integer } userID （暂时）离开会议室的userID
 * @apiParam { Integer } conferenceID （暂时）离开会议室的conferenceID
 * @apiDescription 监听到'exitConference'的处理函数，当用户退出会议室的时候调用
 * @apiSampleRequest off
 * @apiExample Example usage:
 * this.$io.emit('exitConference', userID, conferenceID)
 */
