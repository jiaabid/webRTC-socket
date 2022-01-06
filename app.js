const app = require("express")()
const httpServer = require("http").createServer(app)

const io = require("socket.io")(httpServer,{
    cors:{
        origin:'*',
        methods: ["GET", "POST"]
    }
})
const path = require("path")
const cors = require("cors")



app.use(require("express").static(path.join(__dirname, 'public')))
app.use(require("express").json())
app.use(cors({ origin: true }))







//rendering the first page
app.get("/", (req, res) => {
    res.render('index.html')
})


io.on('connection', (socket) => {
 socket.on('hello',data=>{
     console.log(data)
 })

 socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)  // Join the room
    socket.broadcast.emit('user-connected', userId) // Tell everyone else in the room that we joined
    
    // Communicate the disconnection
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', userId)
    })
})

//  socket.on('join-room',data=>{
//      socket.join(data)
//      socket.emit('room-joined',true);
//  })

//  socket.on('send-stream',payload=>{
//      payload = JSON.parse(payload)
//      console.log(payload)
//      socket.to(payload.uid).emit('stream',JSON.stringify(payload))
//  })

    // chatsHandler(io,socket);
})

module.exports = {
    httpServer,
    app
}