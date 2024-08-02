import React from 'react'
import ChatListHeader from './ChatListHeader'
import SearchBar from './SearchBar'
import List from './List'

export default function ChatList() {
  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
        <>
        <ChatListHeader />
        <SearchBar />
        <List />
        </>
    </div>
  )
}
