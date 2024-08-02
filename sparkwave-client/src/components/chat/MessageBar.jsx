import { useStateProvider } from '@/context/stateContext'
import { SEND_MESSAGE_ROUTE } from '@/utils/apiRoutes'
import axios from 'axios'
import React, { useState } from 'react'
import { BsEmojiSmile } from "react-icons/bs"
import { ImAttachment } from "react-icons/im"
import { MdSend } from "react-icons/md"
// import { FaMicrophone } from 'react-icons/fa'

export default function MessageBar() {
  const [{userInfo, currentChatUser}, dispatch] = useStateProvider()
  const [message,setMessage] = useState("")

  const sendMessage = async()=>{
    try{  
      const {data} = await axios.post(SEND_MESSAGE_ROUTE,{
        to: currentChatUser.id,
        from: userInfo.id,
        message
      })

      setMessage('')
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title='Emoji'
          />
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title='Attach File'
          />
        </div>

        <div className="w-full rounded-lg h-10 flex items-center">
          <input type="text" placeholder="Type a message" 
          className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full" 
          onChange={(e)=> setMessage(e.target.value)}
          value={message}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend
              className="text-panel-header-icon cursor-pointer text-xl"
              title='Send message'
              onClick={sendMessage}
            />
            {/* <FaMicrophone
              className="text-panel-header-icon cursor-pointer text-xl"
              title='Record voice message'
            /> */}
          </button>
        </div>
      </>
    </div>
  )
}
