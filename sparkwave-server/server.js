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
})
