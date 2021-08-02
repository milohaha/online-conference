/**
 * @apiName Homepage
 * @apiDescription 这是一个返回homepage字符串的接口
 * @apiPermission everyone
 * @api {get} / Homepage
 * @apiSuccess {String} homepage 返回一个纯字符串homepage
 * @apiGroup User
 * @apiVersion 0.0.0
 * @apiSampleRequest http://localhost:3000/
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     homepage
 */
/**
 * @apiName Login
 * @apiDescription 用户登录的接口
 * @apiPermission everyone
 * @api {post} /login Login
 * @apiParam {String} userName        用户名称
 * @apiParam {String} password        用户密码
 * @apiSuccess {int} code        结果码，登录成功为0，登录失败为-1。(此码与服务器返回的状态码不同)
 * @apiSuccess {String} message        登录成功：USER_LOGIN 登录失败：WRONG_USERNAME_OR_PASSWORD
 * @apiSuccess {Integer} userID 返回用户ID
 * @apiSuccess {String} token        如果登录成功，返回token用于用户验证
 * @apiSuccess {String} expireTime        如果登录成功，返回token过期时刻的时间戳
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userName": "EpUserName"
 *       "password": "EpPassword"
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 0,
 *       "message": "USER_LOGIN",
 *       "userID": 123
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
 *       "expireTime": "1627493571504"
 *     }
 */
/**
 * @apiName Register
 * @apiDescription 用户注册的接口
 * @apiPermission everyone
 * @api {post} /register Register
 * @apiParam {String} userName        用户名称
 * @apiParam {String} password        用户密码
 * @apiParam {String} email        用户邮箱
 * @apiSuccess {int} code        成功为0，失败为-1
 * @apiSuccess {String} message        成功为USER_REGISTER，失败为ALREADY_REGISTERED
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userName": "EpUserName"
 *       "password": "EpPassword"
 *       "email": "ExEmail@mail.com"
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 0,
 *       "message": "USER_REGISTER"
 *     }
 */

/**
 * @apiName CreateTeam
 * @apiDescription 用户创建团队的接口
 * @apiPermission user
 * @api {post} /team/createTeam CreateTeam
 * @apiParam {String} groupName        team的名称
 * @apiSuccess {String} message        成功:CREATED, 已经存在:EXISTS
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "groupName": "EpGroupName"
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "CREATED"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName CreateConference
 * @apiDescription 用户创建会议室的接口
 * @apiPermission user
 * @api {post} /team/createConference CreateConference
 * @apiParam {String} groupName        会议室的名称
 * @apiParam {int} teamID        team的ID
 * @apiSuccess {String} message        成功:CREATED, 已经存在:EXISTS
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "groupName": "EpConferenceName",
 *       "teamID": 2
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "CREATED"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName getMembers
 * @apiDescription 获取成员或非成员的接口
 * @apiPermission user
 * @api {post} /team/getMembers getMembers
 * @apiParam {int} groupID        查询的group的ID
 * @apiParam {String} groupType        查询的group的类型，"Team"或“Conference"
 * @apiParam {Boolean} inGroup        是否在团队里,true或false
 * @apiSuccess {Object[]} teamMembers       一个包含所需用户的列表.
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "groupID": 3
 *       "groupType": "Team"
 *       “inGroup”: true
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": [{ id: '1', userName: 'username1', email: '299@.com' }, { id: '2', userName: 'username2', email: '298@.com' }]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName checkTeam
 * @apiDescription 加入团队预请求的接口
 * @apiPermission user
 * @api {post} /team/checkTeam checkTeam
 * @apiParam {int} teamID        团队ID
 * @apiSuccess {String} message       可加入:NOT_JOINED, 已经加入:HAS_JOINED, 团队ID不存在:NOT_EXIST, 参数错误:PARAS_ERROR
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "teamID": 3
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'NOT_JOINED'
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName getObjects
 * @apiDescription 请求团队或者会议室列表的接口
 * @apiPermission user
 * @api {post} /team/getObjects getObjects
 * @apiParam {String} model        请求的类型"Team"或"Conference"
 * @apiParam {Object} condition        对该列表的限制条件
 * @apiSuccess {Object[]} objects       列表结果
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "model": "Team"
 *       "condition": { teamName:'123' }
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "objects": [{ id: 1, teamName: '123', founderID: '1', createdAt:'1111-11-11 11:11:11' updatedAt:'1111-11-11 11:11:11' }]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName getMessage
 * @apiDescription 请求未读消息/未处理验证消息的接口
 * @apiPermission user
 * @api {post} /getMessage getMessage
 * @apiParam {String} type 请求的消息类型"notice"或"verification"
 * @apiParam {Integer} userID 用户ID
 * @apiSuccess {Object[]} data 消息列表
 * @apiError 401 未授权，无token或token过期或非指定地址端口访问
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "type": 'notice'
 *       "userID": 1234567
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "data": [
 *          {  id: 1,
 *             title: '系统通知',
 *             content: '您已被移出团队：指尖宇宙',
 *             createdAt:'1111-11-11 11:11:11',
 *             updatedAt:'1111-11-11 11:11:11'
 *          }
 *        ]
 *     }
 *     HTTP/1.1 200 OK
 *     {
 *      "data": [
 *          {  id: 1,
 *             type: 'application',
 *             content: '张三申请加入团队：指尖宇宙',
 *             createdAt:'1111-11-11 11:11:11',
 *             updatedAt:'1111-11-11 11:11:11'
 *          }
 *        ]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "code": -1,
 *       "message": 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName getConferences
 * @apiDescription 请求可加入会议室的接口
 * @apiPermission user
 * @api {post} /team/getConferences getConferences
 * @apiParam {int} teamID        所要查看能加入会议室的所属团队
 * @apiSuccess {Object[]} conferences       可加入会议室的列表
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "teamID": 123
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "conferences": [{id: 1, conferenceName: "团队一号"}]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName getTeamBuiltByMe
 * @apiDescription 请求我创建的团队的接口
 * @apiPermission user
 * @api {post} /team/getTeamBuiltByMe getTeamBuiltByMe
 * @apiParam {Integer} userID
 * @apiSuccess {Object[]} objects       创建的团队的列表
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userID": 123
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "teams": [{id: 1, teamName: "指尖宇宙"}]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */

/**
 * @apiName /getTeamJoined
 * @apiDescription 请求我加入的团队的接口
 * @apiPermission user
 * @api {post} /team/getTeamJoined getTeamJoined
 * @apiParam {Integer} userID
 * @apiSuccess {Object[]} objects       加入的团队的列表
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userID": 123
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "teams": [{id: 1, teamName: "指尖宇宙"}]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       “code”: -1,
 *       ”message“: 'INVALID_TOKEN'
 *     }
 */
