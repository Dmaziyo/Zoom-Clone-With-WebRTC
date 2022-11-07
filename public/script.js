const socket = io('/')
/**
 * Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
 */
const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
myVideo.muted = true
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  })
  .then(stream => {
    // 将自己视频录制流添加进去
    addVideoStream(myVideo, stream)
  })
// 设置一个视频流组件，然后添加进去
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
