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

module.exports = {
    checkUser,
}