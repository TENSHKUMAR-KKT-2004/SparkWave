import React from 'react'
import Avatar from '../common/avatar'
import { useStateProvider } from '@/context/stateContext'
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { reducerCases } from '@/context/constants'

export default function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider()

  const handleAllContactsPage = ()=>{
    dispatch({type: reducerCases.SET_ALL_CONTACTS_PAGE })
  }

  return (
    <div className="h-16 px-4 flex justify-between items-center">
      <div className="curser-pointer">
        <Avatar type={'sm'} image={userInfo?.profileImage}/>
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
        />
        </>
      </div>
    </div>
  )
}
