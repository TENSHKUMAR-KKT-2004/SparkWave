import { reducerCases } from '@/context/constants'
import { useStateProvider } from '@/context/stateContext'
import { GET_ALL_CONTACTS } from '@/utils/apiRoutes'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { BiSearchAlt2 } from 'react-icons/bi'
import ChatListItem from './ChatListItem'

export default function ContactList() {
    const [allContacts, setAllContacts] = useState([])
    const [{ }, dispatch] = useStateProvider()

    useEffect(() => {
        const getContact = async () => {
            try {
                const { data: { users } } = await axios.get(GET_ALL_CONTACTS)
                setAllContacts(users)
            } catch (err) {
                console.log(err)
            }
        }

        getContact()
    }, [])

    return (
        <div className="h-full flex flex-col">
            <div className="h-24 flex items-center px-3 py-4">
                <div className="flex items-center gap-12 text-white">
                    <BiArrowBack
                        className="cursor-pointer text-xl"
                        onClick={() => dispatch({
                            type: reducerCases.SET_ALL_CONTACTS_PAGE
                        })}
                    />
                    <span>New Chat</span>
                </div>
            </div>
            <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
                <div className="flex py-3 items-center gap-3 h-14">
                    <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
                        <div>
                            <BiSearchAlt2
                                className="text-panel-header-icon cursor-pointer text-lg"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search contact"
                                className="bg-transparent text-sm focus:outline-none text-white w-full"
                            />
                        </div>
                    </div>
                </div>
                {
                    Object.entries(allContacts).map(([initialLetter, userList]) => {
                        return (<div key={Date.now() + initialLetter}>
                            <div className="text-teal-light pl-10 py-5">
                                {initialLetter}
                            </div>
                            {
                                userList.map((contact)=>{
                                    return (
                                        <ChatListItem
                                        data={contact}
                                        isContactsPage={true}
                                        key={contact.id}
                                        />
                                    )
                                })
                            }
                        </div>)
                    })
                }
            </div>
        </div>
    )
}
