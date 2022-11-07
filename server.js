const express = require('express')
const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)

const { v4: uuidV4 } = require('uuid')

server.listen(3000)
