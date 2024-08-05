const prisma = require("../utils/prismaClient")
const dotenv = require('dotenv')
const { generateToken04 } = require("../utils/TokenGenerator")

dotenv.config()

const checkUser = async (req,res)=>{

    const { email } = req.body
    try{
        if(!email){
            return res.json({msg: "Email is required", status: false})
        }

        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        
        if(!user){
            return res.json({msg: "User not found", status: false})
        }else{
            return res.json({msg: "User found", status: true, data: user})
        }
    }catch(err){
        console.log(err)
    }
}

const userOnboarding  = async (req,res) =>{
    const { email, name, about, image: profile_picture } = req.body

    try{
        if(!email || !name || !profile_picture){
            return res.send("Email, Name and Profile picture are required")
        }

        const newUser = await prisma.user.create({
            data: {
                email, name, about, profile_picture
            }
        })

        return res.json({msg: "Onboarding Success", status: true, data: newUser})
    }catch(err){
        console.log(err)
    }
}

const getAllUsers = async (req, res)=>{
    try{
        const users = await prisma.user.findMany({
            orderBy: {name : "asc"},
            select: {
                id: true,
                email: true,
                name: true,
                profile_picture: true,
                about: true
            }
        })

        const usersGroupByInitialLetter = {}

        users.forEach((user)=>{
            const initialLetter = user.name.charAt(0).toUpperCase()
            if(!usersGroupByInitialLetter[initialLetter]){
                usersGroupByInitialLetter[initialLetter] = []
            }
            usersGroupByInitialLetter[initialLetter].push(user)
        })

        return res.status(200).send({users: usersGroupByInitialLetter})
    }catch(err){

    }
}

const generateToken = async( req,res)=>{
    try{
        const appId = parseInt(process.env.ZEGO_APP_ID)
        const serverSecret = process.env.ZEGO_SERVER_SECRET

        const userId = req.params.userId

        const effectiveTime = 3600
        const payload = ""

        if(appId && serverSecret && userId){
            const token = generateToken04(appId,userId,serverSecret,effectiveTime,payload)
            
            return res.status(200).json({token})
        }

        return res.status(400).send("userId is required")
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    checkUser,
    userOnboarding,
    getAllUsers,
    generateToken
}