const prisma = require("../utils/prismaClient")
const {renameSync} = require('fs')

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
                    messageStatus: getUser? "delivered" : "sent",
                },
                include:{
                    sender: true, reciever: true
                }
            })

            return res.status(200).send({message: newMessage})
        }
        
        return res.status(400).send("From, To and Message is required")
    } catch (err) {
        console.log(err)
    }
}

const getMessages = async (req, res)=>{
    try{
        const {from, to} = req.params
        console.log(from, to)
        const messages = await prisma.messages.findMany({
            where:{
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
            orderBy:{
                id: "asc"
            }
        })

        const unreadMessages = []

        messages.forEach((message, index) => {
            if(message.messageStatus !== "read" && message.senderId === parseInt(to)){
                messages[index].messageStatus="read"
                unreadMessages.push(message.id)
            }
        })

        await prisma.messages.updateMany({
            where:{
                id: {in: unreadMessages}
            }, 
            data:{
                messageStatus: "read"
            }
        })

        return res.status(200).json({messages})
    }catch(err){
        console.log(err)
    }
}

const addImageMessage = async (req, res)=>{
    try{
        if(req.file){
            const date = Date.now()
            let fileName = 'uploads/images'+date+req.file.originalName
            renameSync(req.file.path, fileName)

            const { from, to} = req.query

            if(from && to){
                const message = await prisma.messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: parseInt(from) } },
                        reciever: { connect: { id: parseInt(to) } },
                        type: "image",
                    }
                })

                return res.status(200).json({message})
            }

            return res.status(400).send("from & to is required")
        }

        return res.status(400).send("image is required")
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addMessages,
    getMessages,
    addImageMessage
}
