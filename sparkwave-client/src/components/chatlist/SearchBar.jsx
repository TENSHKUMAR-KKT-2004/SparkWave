import { reducerCases } from '@/context/constants'
import { useStateProvider } from '@/context/stateContext'
import React, { useState, useEffect } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import { BsFilter } from 'react-icons/bs'

export default function SearchBar() {
  const [{contactSearch, userContacts}, dispatch] = useStateProvider()
  const [sortCriteria, setSortCriteria] = useState('unread')

  useEffect(() => {
    const sortContacts = (contacts) => {
      if (sortCriteria === 'unread') {
        dispatch({type: reducerCases.FILTER_UNREAD_CHATS})
      } else if (sortCriteria === 'time') {
        dispatch({type: reducerCases.FILTER_TIME_CHATS})
      }
    }

    sortContacts(userContacts)
  }, [sortCriteria])

  const handleFilterClick = () => {
    setSortCriteria(prev => prev === 'unread' ? 'time' : 'unread')
  }

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 
          className="text-panel-header-icon cursor-pointer text-lg"
          />
        </div>

        <div>
          <input 
          type="text" 
          placeholder="Search Chat" 
          className="bg-transparent text-sm focus:outline-none text-white w-full"
          value={contactSearch}
          onChange={e=>dispatch({type:reducerCases.SET_CONTACT_SEARCH,contactSearch:e.target.value})}
          />
        </div>
      </div>
      <div className="pr-5 pl-3 ">
        <BsFilter 
        className="text-white cursor-pointer text-xl"
        onClick={handleFilterClick}
        />
      </div>
    </div>
  )
}
