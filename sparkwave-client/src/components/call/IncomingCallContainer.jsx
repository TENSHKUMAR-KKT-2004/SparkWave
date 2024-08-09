import { useStateProvider } from '@/context/stateContext'
import React, { useState, useEffect, useRef } from 'react'
import { MdOutlineCallEnd } from 'react-icons/md'
import Avatar from '../common/avatar'

export default function IncomingCallContainer({ data }) {
    const [{ peer, onlinePeerUsers }] = useStateProvider()
    const [localStream, setLocalStream] = useState(null)

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)

    useEffect(() => {
        const setupMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                setLocalStream(stream)
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream
                }
            } catch (error) {
                console.error('Error accessing media devices:', error)
            }
        }

        setupMedia()
    }, [])


    return (
        <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white p-5">
            <div className="flex flex-col gap-3 items-center py-5">
                <span><Avatar type={'lg'} image={data.profile_picture} /></span>
                <span className="text-4xl">{data?.name}</span>
                <span className="text-lg">
                    {
                        callAccepted && data.callType !== "video" ? 'On going call' : "Calling..."
                    }
                </span>
            </div>

            <div className="relative w-full h-[90vh] grid grid-cols-2 gap-2 py-5">
                <div className="flex items-center justify-center bg-gray-800">
                    <video
                        ref={remoteVideoRef}
                        id="remote-video"
                        autoPlay
                        playsInline
                        className="w-[420px] h-[340px] object-cover"
                    ></video>
                </div>

                <div className="flex items-center justify-center bg-gray-900">
                    <video
                        ref={localVideoRef}
                        id="local-video"
                        autoPlay
                        playsInline
                        muted
                        className="w-[420px] h-[340px] object-cover"
                    ></video>
                </div>
            </div>

            <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
                <MdOutlineCallEnd onClick={endCall} className="cursor-pointer text-3xl" />
            </div>
        </div>
    )
}
