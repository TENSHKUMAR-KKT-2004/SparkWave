import React, { useState } from 'react'
import Avatar from '../common/avatar'
import { useStateProvider } from '@/context/stateContext'
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { reducerCases } from '@/context/constants'
import { useRouter } from 'next/router'
import ContextMenu from '../common/ContextMenu'

export default function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider()
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [contextMenuCo_ords, setContextMenuCo_ords] = useState({ x: 0, y: 0 })

  const router = useRouter()

  const handleAllContactsPage = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
  }

  const showContextMenu = (e) => {
    e.preventDefault()
    setContextMenuCo_ords({ x: e.pageX, y: e.pageY })
    setIsContextMenuVisible(true)
  }

  const contextMenuOptions = [
    {
      name: "Logout", callback: () => {
        setIsContextMenuVisible(false)
        router.push('/logout')
      }
    },
  ]

  return (
    <div className="h-16 px-4 flex justify-between items-center">
      <div className="curser-pointer">
        <Avatar type={'sm'} image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title='New Chat'
          onClick={handleAllContactsPage}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title='Menu'
            id="context-opener"
            onClick={(e) => showContextMenu(e)}
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
        </>
      </div>
    </div>
  )
}
