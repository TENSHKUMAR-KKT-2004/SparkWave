import React, { useState, useEffect } from 'react'
import Avatar from '../common/avatar'
import { MdCall } from 'react-icons/md'
import { IoVideocam } from 'react-icons/io5'
import { BiSearchAlt2 } from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useStateProvider } from '@/context/stateContext'
import { reducerCases } from '@/context/constants'

export default function ChatHeader() {
  const [{ currentChatUser }, dispatch] = useStateProvider()
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(currentChatUser?.name)
  }, [currentChatUser])

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: 'out-going',
        callType: 'voice',
        roomId: Date.now()
      }
    })
  }

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: 'out-going',
        callType: 'video',
        roomId: Date.now()
      }
    })
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.profile_picture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{userName}</span>
          <span className="text-secondary text-sm">Online/Offline</span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
        />
      </div>
    </div>
  )
}
