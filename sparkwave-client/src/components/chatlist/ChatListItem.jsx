import React from 'react'
import Avatar from '../common/avatar'
import { useStateProvider } from '@/context/stateContext'
import { reducerCases } from '@/context/constants'
import { calculateTime } from '@/utils/calculateTime'
import MessageStatus from '../common/MessageStatus'
import { FaCamera, FaMicrophone } from 'react-icons/fa'
import { RiFileGifFill } from "react-icons/ri";

export default function ChatListItem({ data, isContactsPage = false }) {
    const [{ userInfo }, dispatch] = useStateProvider()
    const handleContactClick = () => {
        if (!isContactsPage) {
            dispatch({
                type: reducerCases.CHANGE_CURRENT_CHAT_USER,
                user: {
                    name: data.name,
                    about: data.about,
                    profile_picture: data.profile_picture,
                    email: data.email,
                    id: userInfo.id === data.senderId ? data.recieverId : data.senderId
                }
            })
        } else {
            dispatch({ type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: { ...data } })
            dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
        }
    }

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    return (
        <div
            className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
            onClick={handleContactClick}
        >
            <div className="min-w-fit px-5 pt-3 pb-1">
                <Avatar type="lg" image={data?.profile_picture} />
            </div>
            <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
                <div className="flex justify-between ">
                    <div>
                        <span className="text-white">{userInfo.id === data?.id ? "You" : data?.name}</span>
                    </div>
                    {
                        !isContactsPage &&
                        <div >
                            <span className={`${!data.totalUnreadMessages > 0 ? 'text-secondary' : 'text-icon-green'} text-sm`}>
                                {calculateTime(data.createdAt)}
                            </span>
                        </div>
                    }
                </div>
                <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
                    <div className="flex justify-between w-full">
                        <span className="text-secondary line-clamp-1 text-sm">
                            {
                                isContactsPage ?
                                    data?.about || "\u00A0" :
                                    <div
                                        className="flex items-center gap-1 max-w-[200px] xl:max-w-[300px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px]">
                                        {
                                            data.senderId === userInfo.id && <MessageStatus messageStatus={data.messageStatus} />
                                        }
                                        {
                                            data.type === 'text' && <span className="truncate">{truncateText(data.message, 20)}</span>
                                        }
                                        {
                                            data.type === 'image' && <span className="flex gap-1 items-center">
                                                <FaCamera className="text-panel-header-icon" /> Image
                                            </span>
                                        }
                                        {
                                            data.type === 'audio' && <span className="flex gap-1 items-center">
                                                <FaMicrophone className="text-panel-header-icon" /> Audio
                                            </span>
                                        }
                                        {
                                            data.type === 'gif' && <span className="flex gap-1 items-center">
                                                <RiFileGifFill className="text-panel-header-icon text-lg" /> Gif
                                            </span>
                                        }
                                    </div>
                            }
                        </span>
                        {
                            data.totalUnreadMessages > 0 && <span className="bg-icon-green px-[5px] rounded-full text-sm">{data.totalUnreadMessages}</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
