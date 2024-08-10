import React, { useState, useEffect } from 'react'
import Avatar from '../common/avatar'
import { MdCall } from 'react-icons/md'
import { IoVideocam } from 'react-icons/io5'
import { BiSearchAlt2 } from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useStateProvider } from '@/context/stateContext'
import { reducerCases } from '@/context/constants'
import ContextMenu from '../common/ContextMenu'
import { toast } from 'react-toastify'

export default function ChatHeader() {
  const [{ currentChatUser, userInfo, onlineUsers }, dispatch] = useStateProvider()
  const [userName, setUserName] = useState('')
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [contextMenuCo_ords, setContextMenuCo_ords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setUserName(currentChatUser?.name)
  }, [currentChatUser])

  const handleVoiceCall = () => {
    onlineUsers[currentChatUser.id] ? dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: 'out-going',
        callType: 'voice',
        roomId: Date.now()
      }
    })  : toast.error('The user is currently offline. Please try again later')
  }

  const showContextMenu = (e) => {
    e.preventDefault()
    setContextMenuCo_ords({ x: e.pageX - 50, y: e.pageY + 20 })
    setIsContextMenuVisible(true)
  }

  const contextMenuOptions = [
    {
      name: "Exit", callback: () => {
        dispatch({ type: reducerCases.SET_EXIT_CHAT })
      }
    },
  ]

  const handleVideoCall = () => {
    onlineUsers[currentChatUser.id] ? dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: 'out-going',
        callType: 'video',
        roomId: Date.now()
      }
    }) : toast.error('The user is currently offline. Please try again later')
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.profile_picture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{userInfo.id === currentChatUser.id ? "You" : userName}</span>
          <span className="text-secondary text-sm">{onlineUsers[currentChatUser.id] ? 'Online' : 'Offline'}</span>
        </div>
      </div>
      <div className="flex gap-6">
      {userInfo.id !== currentChatUser.id && <> <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVideoCall}
        />
        </>
      }
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          id="context-opener"
          onClick={(e)=> showContextMenu(e)}
        />
        {
          isContextMenuVisible && (
            <ContextMenu
            options={contextMenuOptions}
            cordinates={contextMenuCo_ords}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
            />
          )
        }
      </div>
    </div>
  )
}
