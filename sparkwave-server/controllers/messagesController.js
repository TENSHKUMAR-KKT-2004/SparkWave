const prisma = require("../utils/prismaClient")
const { renameSync } = require('fs')

const addMessages = async (req, res) => {
    try {
        const { message, from, to } = req.body
        const getUser = onlineUsers.get(to)
        if (message && from && to) {
            const newMessage = await prisma.messages.create({
                data: {
                    message,
                    sender: { connect: { id: parseInt(from) } },
                    reciever: { connect: { id: parseInt(to) } },
                    messageStatus: getUser ? "delivered" : "sent",
                },
                include: {
                    sender: true, reciever: true
                }
            })

            return res.status(200).send({ message: newMessage })
        }

        return res.status(400).send("From, To and Message is required")
    } catch (err) {
        console.log(err)
    }
}

const getMessages = async (req, res) => {
    try {
        const { from, to } = req.params
        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    {
                        senderId: parseInt(from),
                        recieverId: parseInt(to)
                    },
                    {
                        senderId: parseInt(to),
                        recieverId: parseInt(from)
                    }
                ]
            },
            orderBy: {
                id: "asc"
            }
        })

        const unreadMessages = []

        messages.forEach((message, index) => {
            if (message.messageStatus !== "read" && message.senderId === parseInt(to)) {
                messages[index].messageStatus = "read"
                unreadMessages.push(message.id)
            }
        })

        await prisma.messages.updateMany({
            where: {
                id: { in: unreadMessages }
            },
            data: {
                messageStatus: "read"
            }
        })

        return res.status(200).json({ messages })
    } catch (err) {
        console.log(err)
    }
}

const addImageMessage = async (req, res) => {
    const { from, to } = req.query
    // console.log('file is uploading')
    try {
        if (req.file) {
            const fileName = 'uploads/images/' + req.file.filename

            if (from && to) {
                const message = await prisma.messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: parseInt(from) } },
                        reciever: { connect: { id: parseInt(to) } },
                        type: "image",
                    }
                })

                return res.status(201).json({ message })
            }

            return res.status(400).send("from & to is required")
        }

        return res.status(400).send("image is required")
    } catch (err) {
        console.log(err)
    }
}

const addAudioMessage = async (req, res) => {
    const { from, to } = req.query
    // console.log('file is uploading')
    try {
        if (req.file) {
            const fileName = 'uploads/recordings/' + req.file.filename

            if (from && to) {
                const message = await prisma.messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: parseInt(from) } },
                        reciever: { connect: { id: parseInt(to) } },
                        type: "audio",
                    }
                })

                return res.status(201).json({ message })
            }

            return res.status(400).send("from & to is required")
        }

        return res.status(400).send("audio is required")
    } catch (err) {
        console.log(err)
    }
}

const getInitialContactsWithMessages = async (req, res) => {

    try {
        const userId = parseInt(req.params.from)

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                sentMessages: {
                    include: {
                        reciever: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                recievedMessages: {
                    include: {
                        reciever: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })

        const messages = [...user.sentMessages, ...user.recievedMessages]
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        const users = new Map()  // key: u-id, value: user & data
        const messageStatusChange = []

        messages.forEach((message)=>{
            const isSender = message.senderId === userId
            const calculatedOpositeUserId = isSender ? message.recieverId : message.senderId
            
            if(message.messageStatus === "sent"){
                messageStatusChange.push(message.id)
            }

            const {
                id,
                type,
                messageStatus,
                createdAt,
                senderId,
                recieverId
            } = message

            if(!users.get(calculatedOpositeUserId)){
                let user = {
                    messageId: id,
                    type,
                    message: message.message,
                    messageStatus,
                    createdAt,
                    senderId,
                    recieverId
                }

                if(isSender){
                    user = {
                        ...user,
                        ...message.reciever,
                        totalUnreadMessages:0
                    }
                }else{
                    user = {
                        ...user,
                        ...message.sender,
                        totalUnreadMessages: messageStatus !== "read" ? 1 : 0
                    }
                }

                users.set(calculatedOpositeUserId,{...user})
            } else if(message.messageStatus !== "read" && !isSender){ // for counting the total unread messages
                const user = users.get(calculatedOpositeUserId)
                users.set(calculatedOpositeUserId, {
                    ...user,
                    totalUnreadMessages: user.totalUnreadMessages + 1
                })
            }
        })

        if(messageStatusChange.length){ // updating status from sent to delivered
            await prisma.messages.updateMany({
                where: {
                    id: { in: messageStatusChange }
                },
                data: {
                    messageStatus: "delivered"
                }
            })
        }

        return res.status(200).json({
            users: Array.from(users.values())
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    addMessages,
    getMessages,
    addImageMessage,
    addAudioMessage,
    getInitialContactsWithMessages
}
