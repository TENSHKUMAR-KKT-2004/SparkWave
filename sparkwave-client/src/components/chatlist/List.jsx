import { reducerCases } from '@/context/constants'
import { useStateProvider } from '@/context/stateContext'
import { GET_INITIAL_CONTACTS_ROUTE } from '@/utils/apiRoutes'
import axios from 'axios'
import React, { useEffect } from 'react'
import ChatListItem from './ChatListItem'

export default function List() {

  const [{ userInfo, userContacts, filteredContacts }, dispatch] = useStateProvider()

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data: { users, onlineUsers } } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`)

        dispatch({
          type: reducerCases.SET_USER_CONTACTS,
          userContacts: users
        })

        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers
        })
      } catch (err) {
        console.log(err)
      }
    }

    if (userInfo?.id) {
      getContacts()
    }
  }, [userInfo, dispatch])

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {
        filteredContacts && filteredContacts.length > 0 ? filteredContacts.map(contact => <ChatListItem key={contact.id} data={contact} />) :
          userContacts && userContacts.map((contact) => <ChatListItem key={contact.id} data={contact} />)
      }
    </div>
  )
}
