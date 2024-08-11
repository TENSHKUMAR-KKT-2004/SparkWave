import React from 'react'
import { useStateProvider } from '@/context/stateContext'
import { calculateTime } from '@/utils/calculateTime'
import MessageStatus from '../common/MessageStatus'

export default function GifMessage({ message }) {
    const [{ currentChatUser, userInfo }] = useStateProvider()

    return (
        <div className={`p-1 rounded-lg ${message.senderId === currentChatUser.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}>
            <div className="relative">
                <img src={message.message} alt="gif" className="rounded-lg" height={300} width={300} />
                <div className="absolute bottom-1 right-1 flex items-end gap-1">
                    <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {
                            calculateTime(message.createdAt)
                        }
                    </span>
                    <span className="text-bubble-meta">
                        {
                            message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus}/>
                        }
                    </span>
                </div>
            </div>
        </div>
    )
}
