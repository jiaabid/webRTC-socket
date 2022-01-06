
window.onload=()=>{
    console.log('in hello')
    const socket = io() // socket
    const myPeer = new Peer(undefined,{
        path:"/",
host:"/",
port:5000
    }) //peer (webrtc wrapper)
    console.log(myPeer)
    // console.log(navigator.mediaDevices.getSupportedConstraints())
    const videoGrid = document.getElementById('video-grid') 
    const myVideo = document.createElement('video') // Create a new video tag to show our video
    myVideo.muted = ''
console.log(navigator)
// if(navigator.getUserMedia){
//     console.log('yes i have navigator')
//     console.log(navigator)
//     navigator.mediaDevices.getUserMedia({
//         video:true,
//         audio:{

  
//              sampleRate: 48000,
//              channelCount: 1,
//              volume: 0.5,
//              echoCancellation:true,
//              noiseSuppression:true,
//              autoGainControl:false
//         }
        
//     }).then(stream=>{
//         console.log(stream)
//         myVideo.mozSrcObject = stream
//         myVideo.addEventListener('loadmetadata', () => { // Play the video as it loads
//             myVideo.play()
//         })
//         videoGrid.append(myVideo) 
//     })
// }


//     if(!navigator.getUserMedia){
//        console.log('in not')
//     navigator.getUserMedia = navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia;
// }


  
   
//   navigator.mediaDevices.getUserMedia({video:true,audio:false,echoCancelation:true}).then(stream=>{
//       console.log(stream)
//       window.stream = stream
//       let recorder = new MediaRecorder(stream)
//       recorder.start(1000);
//       recorder.addEventListener("dataavailable",(e)=>{
//           console.log(e.data,'my stream')
//       })

//       document.querySelector("video").srcObject = stream
//   })
// Access the user's video and audio
let media = navigator.mediaDevices
let streamer = media ? media.getUserMedia : navigator.getUserMedia
console.log(navigator.mediaDevices.getUserMedia)
navigator.mediaDevices.getUserMedia({
    video: true,
    audio:{

  
        //  sampleRate: 48000,
        //  channelCount: 2,
         volume: 1.0,
         echoCancellation:true,
         noiseSuppression:true,
         autoGainControl:true
    }
}).then(stream => {
    console.log(stream,'gfg')
    // console.log(stream.getConstraints())
    addVideoStream(myVideo, stream) // Display our video to ourselves
   
    myPeer.on('call', call => { // When we join someone's room we will receive a call from them
        call.answer(stream) // Stream them our video/audio
        const video = document.createElement('video') // Create a video tag for them
        call.on('stream', userVideoStream => { // When we recieve their stream
            addVideoStream(video, userVideoStream) // Display their video to ourselves
        })
    })

    socket.on('user-connected', userId => { // If a new user connect
        connectToNewUser(userId, stream) 
    })
})
let ROOM_ID =1
myPeer.on('open', id => { // When we first open the app, have us join a room
    console.log(id)
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) { // This runs when someone joins our room
    const call = myPeer.call(userId, stream) // Call the user who just joined
    // Add their video
    const video = document.createElement('video') 
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    // If they leave, remove their video
    call.on('close', () => {
        video.remove()
    })
}

//   socket.on('connect',()=>{
//       socket.emit('hello',"1")
//       let id = prompt("Enter your id!")
//       if(id){
//           socket.emit('join-room',id);
//       }
//   })

  socket.on('room-joined',data=>{
    //   if(data){
    //       alert("Room joined successfully!")
    //   }
  })
//   document.querySelector('button').addEventListener('click',async e=>{
//       e.preventDefault();
//     //   return console.log(window.stream)
//     let videoStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
//     let audioStream = await navigator.mediaDevices.getUserMedia({audio:true,video:false})
//     let tracks = [...videoStream.getTracks(),...audioStream.getAudioTracks()];
//     console.log(tracks,'trakcs')
//     let recorder = new MediaRecorder(videoStream)
//     recorder.addEventListener('dataavailable',e=>{
//         console.log(e)
//     })
//     recorder.start(1000)
//     // document.querySelector("video").srcObject = new MediaStream(tracks)
//     //   socket.emit('send-stream',JSON.stringify({
//     //       stream:tracks,
//     //       uid:prompt("Enter the user address")
//     //   }))
//   })

  socket.on('stream',data=>{
      console.log(data,'recieve stream')
      data = JSON.parse(data)
      let newStream = new MediaStream(data.stream)
      document.querySelector("video").srcObject = data.stream
  })
  function addVideoStream(video, stream) {
    video.srcObject = stream 
    video.addEventListener('loadedmetadata', () => { // Play the video as it loads
        video.play()
    })
    videoGrid.append(video) // Append video element to videoGrid
}
};

