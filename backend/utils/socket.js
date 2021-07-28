module.exports = function (server) {
  const io = require('socket.io')(server)
  io.on('connection', function (socket) {
    console.log('socketio connected')
    socket.on('sendMsg', function (data) {
      io.broadcast.emit('receiveMsg')
    })
  })
}
