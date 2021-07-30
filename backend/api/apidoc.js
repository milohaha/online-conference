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
 * @api {post} /team/createteam CreateTeam
 * @apiParam {String} teamName        团队名称
 * @apiSuccess {String} message        成功:CREATED, 已经存在:EXISTS
 * @apiError 401        未授权，无token或token过期或非指定地址端口访问
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "teamName": "EpTeamName"
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
 * @apiDescription 获取所有人员是否在团队里的接口
 * @apiPermission user
 * @api {get} /team/getMembers getMembers
 * @apiParam {int} teamID        团队ID
 * @apiSuccess {Object[]} teamMembers       一个包含用户是否存在于此团队的列表.
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
 *       "message": [{ userName: 'username1', ifInTeam: true }, { userName: 'username2', ifInTeam: false }]
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
