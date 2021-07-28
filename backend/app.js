const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const expressJWT = require('express-jwt')

const userRouter = require('./routes/user')
const teamRouter = require('./routes/team')
const { PRIVATE_KEY, CODE_ERROR } = require('./utils/constant')

const app = express()
app.disable('x-powered-by')

const server = require('http').createServer(app)
require('./utils/socket')(server)

// cross-domain
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Headers', 'authorization,Content-Type,x-csrftoken,x-requested-with')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 校验token
app.use(expressJWT({
  secret: PRIVATE_KEY,
  algorithms: ['HS256']
}).unless({
  path: ['/', '/login', '/register']
}))

app.use('/', userRouter)
app.use('/team', teamRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401)
      .json({
        code: CODE_ERROR,
        message: 'INVALID_TOKEN'
      })
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  }
})

module.exports = app
