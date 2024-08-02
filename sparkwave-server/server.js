const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

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

global.onlineUsers = new Map()