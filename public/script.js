const socket = io('/')
/**
 * Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
 */
let peerId
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/', //当前页面的host
  port: 3001, //STUN/TURN服务器的端口号
  debug: 2
})
const myVideo = document.createElement('video')
const div = document.createElement('div')
myVideo.muted = true
const peers = {}
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  })
  .then(stream => {
    //2.将自己视频录制流添加进去
    addVideoStream(myVideo, stream, div)

    socket.on('user-connected', userId => {
      // 3.听到用户的新通知,将自己介绍过去
      connectToNewUser(userId, stream)
    })

    // 4.接收其他之前加入的用户传来的信息
    myPeer.on('call', mediaConnection => {
      peers[mediaConnection.peer] = mediaConnection
      //获取call传过来的stream并进行相应操作
      mediaConnection.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream, new_div)
      })
      mediaConnection.on('close', () => {
        new_div.remove()
      })
      //将自己的stream发给对方
      mediaConnection.answer(stream)
      const video = document.createElement('video')
      const new_div = document.createElement('div')
    })
    socket.emit('join-room', ROOM_ID, peerId)
  })

// 1.peer 连接 STUN/TURN服务器,利用socket向该room的人广播通知
myPeer.on('open', id => {
  peerId = id
})

// 5.监听socket断开
socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close()
  }
})

// 3.听到用户的新通知,将自己介绍过去
function connectToNewUser(userId, stream) {
  const mediaConnection = myPeer.call(userId, stream)
  const video = document.createElement('video')
  const div = document.createElement('div')
  //   将新加入的用户视频流添加至grid
  mediaConnection.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, div)
    console.log('添加成功')
  })

  mediaConnection.on('close', () => {
    //6.断开视频
    div.remove()
  })

  peers[userId] = mediaConnection
}

// 设置一个视频流组件，然后添加进去
function addVideoStream(video, stream, div) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  div.append(video)
  videoGrid.append(div)
}
