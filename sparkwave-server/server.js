const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const {Server} = require('socket.io')

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// routes
const authRoute = require('./routes/authRoute')
const messageRoute = require('./routes/messageRoute')

app.use("/uploads/images", express.static("uploads/images"))
app.use("/uploads/recordings", express.static("uploads/recordings"))

app.use('/api/auth',authRoute)
app.use('/api/messages',messageRoute)

const server = app.listen(8080,()=>{
    console.log('Server running on http://localhost:8080')
})

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000"
    }
})

global.onlineUsers = new Map()

io.on("connection",(socket)=>{
    global.chatSocket = socket

    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-message",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('message-recieve',{
                from: data.from,
                message: data.message
            })
        }
    })

    socket.on('outgoing-voice-call',(data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("incoming-voice-call",{
                from: data.from, roomId: data.roomId, callType: data.callType
            })
        }
    })

    socket.on('outgoing-video-call',(data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        console.log('s',data.from)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("incoming-video-call",{
                from: data.from, roomId: data.roomId, callType: data.callType
            })
        }
    })

    socket.on('accept-incoming-call',({id})=>{
        const sendUserSocket = onlineUsers.get(id)

        socket.to(sendUserSocket).emit('accept-call')
    })

    socket.on('reject-voice-call', (data)=>{
        const sendUserSocket = onlineUsers.get(data.from)

        if(sendUserSocket){
            socket.to(sendUserSocket).emit("voice-call-rejected")
        }
    })

    socket.on('reject-video-call', (data)=>{
        const sendUserSocket = onlineUsers.get(data.from)

        if(sendUserSocket){
            socket.to(sendUserSocket).emit("video-call-rejected")
        }
    })
})
