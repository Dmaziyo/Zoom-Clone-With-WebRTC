const express = require('express')
const app = express() // 只是封装了request的hanlder
/**
 * Express initializes app to be a function handler that you can supply to an HTTP server
 */
const server = require('http').Server(app)

// 让socket知道我们使用的服务器,并开个门用于交互
const io = require('socket.io')(server) // socket的作用是检测新用户的进入

const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public')) //设置静态资源目录

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    // 能够加入&创建一个频道
    socket.join(roomId)
    // 发给所有其他人，但不会发给当前socket
    socket.to(roomId).emit('user-connected', userId)

    // 5.断开连接
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3000, function () {
  console.log('server is running on http://localhost:3000/')
})
