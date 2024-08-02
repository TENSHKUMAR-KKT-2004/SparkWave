const prisma = require("../utils/prismaClient")

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
                    messageStatus: getUser?"delivered":"send",
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

module.exports = {
    addMessages,
}
