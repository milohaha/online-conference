'use strict'

const EventEmitter = require('events').EventEmitter
const TextOperation = require('./text-operation')
const WrappedOperation = require('./wrapped-operation')
const Server = require('./server')
const Selection = require('./selection')
const util = require('util')
const { models } = require('../utils/database')

function EditorSocketIOServer (document, operations, docId, mayWrite) {
  EventEmitter.call(this)
  Server.call(this, document, operations)
  this.users = {}
  this.docId = docId
  this.mayWrite = mayWrite || function (_, cb) {
    const flag = true
    cb(flag)
  }
}

util.inherits(EditorSocketIOServer, Server)
extend(EditorSocketIOServer.prototype, EventEmitter.prototype)

function extend (target, source) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key]
    }
  }
}

EditorSocketIOServer.prototype.addClient = function (socket) {
  const self = this
  let shouldUpdate = true
  let content
  socket
    .join(this.docId)
    .emit('doc', {
      str: this.document,
      revision: this.operations.length,
      clients: this.users
    })
    .on('operation', function (revision, operation, selection, value = undefined) {
      // 不使用self.document是因为它是未经本次operation的文本
      content = value
      if (shouldUpdate) {
        shouldUpdate = false
        setTimeout(() => {
          models.ConferenceBlock.update({
            contents: content
          }, {
            where: {
              itemID: self.docId
            }
          }).then(() => { shouldUpdate = true })
        }, 2000)
      }
      self.mayWrite(socket, function (mayWrite) {
        if (!mayWrite) {
          console.log("User doesn't have the right to edit.")
          return
        }
        self.onOperation(socket, revision, operation, selection)
      })
    })
    .on('selection', function (obj) {
      self.mayWrite(socket, function (mayWrite) {
        if (!mayWrite) {
          console.log("User doesn't have the right to edit.")
          return
        }
        self.updateSelection(socket, obj && Selection.fromJSON(obj))
      })
    })
    .on('disconnect', function () {
      console.log('Disconnect')
      socket.leave(self.docId)
      self.onDisconnect(socket)
      if (
        (socket.manager && socket.manager.sockets.clients(self.docId).length === 0) || // socket.io <= 0.9
        (socket.ns && Object.keys(socket.ns.connected).length === 0) // socket.io >= 1.0
      ) {
        self.emit('empty-room')
      }
    })
}

EditorSocketIOServer.prototype.onOperation = function (socket, revision, operation, selection) {
  let wrapped
  try {
    wrapped = new WrappedOperation(
      TextOperation.fromJSON(operation),
      selection && Selection.fromJSON(selection)
    )
  } catch (exc) {
    console.error('Invalid operation received: ' + exc)
    return
  }

  try {
    const clientId = socket.id
    const wrappedPrime = this.receiveOperation(revision, wrapped)
    console.log('new operation: ' + wrapped)
    this.getClient(clientId).selection = wrappedPrime.meta
    socket.emit('ack')
    socket.broadcast.in(this.docId).emit(
      'operation', clientId,
      wrappedPrime.wrapped.toJSON(), wrappedPrime.meta
    )
  } catch (exc) {
    console.error(exc)
  }
}

EditorSocketIOServer.prototype.updateSelection = function (socket, selection) {
  const clientId = socket.id
  if (selection) {
    this.getClient(clientId).selection = selection
  } else {
    delete this.getClient(clientId).selection
  }
  socket.broadcast.in(this.docId).emit('selection', clientId, selection)
}

EditorSocketIOServer.prototype.setName = function (socket, name) {
  const clientId = socket.id
  this.getClient(clientId).name = name
  socket.broadcast.in(this.docId).emit('set_name', clientId, name)
}

EditorSocketIOServer.prototype.getClient = function (clientId) {
  return this.users[clientId] || (this.users[clientId] = {})
}

EditorSocketIOServer.prototype.onDisconnect = function (socket) {
  const clientId = socket.id
  delete this.users[clientId]
  socket.broadcast.in(this.docId).emit('client_left', clientId)
}

module.exports = EditorSocketIOServer
