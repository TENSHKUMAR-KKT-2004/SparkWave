const prisma = require("../utils/prismaClient")

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

module.exports = {
    checkUser,
    userOnboarding,
}