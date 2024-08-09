import { useStateProvider } from '@/context/stateContext';
import React, { useState, useEffect, useCallback } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';
import peer from '../../service/peer';
import Avatar from '../common/avatar';
import { reducerCases } from '@/context/constants';

export default function Container({ data }) {
    const [{ socket, onlineUsers }, dispatch] = useStateProvider()
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [callAccepted, setCallAccepted] = useState(false)
    const [isStreamed, setIsStreamed] = useState(false)

    useEffect(() => {
        if (data.type === "out-going") {
            socket.current.on("accept-call", () => setCallAccepted(true))
        }
    }, [data])

    useEffect(() => {
        const setupMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                const offer = await peer.getOffer()
                socket.current.emit("user-call", { to: onlineUsers[data.id], offer })
                setLocalStream(stream)
            } catch (error) {
                console.error('Error accessing media devices:', error)
            }
        }

        setupMedia()
    }, [data, socket.current])

    const handleIncommingCall = useCallback(async ({ from, offer }) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        setLocalStream(stream)
        const ans = await peer.getAnswer(offer)
        socket.current.emit("call-accepted", { to: from, ans })
    }, [socket.current])

    const sendStreams = useCallback(() => {
        if (localStream) {
            setIsStreamed(true)
            localStream.getTracks().forEach(track => {
                peer.peer.addTrack(track, localStream)
            })
        }
    }, [localStream])

    const handleCallAccepted = useCallback(({ from, ans }) => {
        peer.setLocalDescription(ans)
        sendStreams()
    }, [sendStreams])

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer()
        socket.current.emit("peer-nego-needed", { offer, to: onlineUsers[data.id] })
    }, [onlineUsers, socket.current])

    const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer)
        socket.current.emit("peer-nego-done", { to: from, ans })
    }, [socket.current])

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans)
    }, [])

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded)
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded)
        }
    }, [handleNegoNeeded])

    useEffect(() => {
        peer.peer.addEventListener("track", (event) => {
            setRemoteStream(event.streams[0])
        })
    }, [])

    useEffect(() => {
        socket.current.on("incomming-call", handleIncommingCall)
        socket.current.on("call-accepted", handleCallAccepted)
        socket.current.on("peer-nego-needed", handleNegoNeedIncomming)
        socket.current.on("peer-nego-final", handleNegoNeedFinal)

        socket.current.on('video-call-rejected', () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop())
            }
            // if (peer.peer) {
            //     peer.peer.close()
            // }

            dispatch({
                type: reducerCases.END_CALL
            })
        })

        return () => {
            socket.current.off("incomming-call", handleIncommingCall)
            socket.current.off("call-accepted", handleCallAccepted)
            socket.current.off("peer-nego-needed", handleNegoNeedIncomming)
            socket.current.off("peer-nego-final", handleNegoNeedFinal)
        }
    }, [socket.current, handleIncommingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal])

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop())
        }
        // if (peer.peer) {
        //     peer.peer.close()
        // }

        dispatch({ type: reducerCases.END_CALL })
        setLocalStream(null)
        setIsStreamed(false)
        setRemoteStream(null)

        if (data.callType === "video") {
            socket.current.emit("reject-video-call", {
                from: data.id
            })
        }
    }

    return (
        <div className="border-conversation-border overflow-y-auto border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] items-center justify-center text-white p-5">
            <div className="flex flex-col gap-3 items-center py-5">
                <span><Avatar type={'lg'} image={data.profile_picture} /></span>
                <span className="text-4xl">{data?.name}</span>
                <span className="text-lg">
                    {!callAccepted && !isStreamed && data.callType !== "video" && 'Calling...'}
                    {!isStreamed && callAccepted && localStream && data.type === "out-going" && <div className="bg-green-600 flex items-center p-2 justify-center rounded-xl"><button onClick={sendStreams} className="cursor-pointer text-lg">Click to Connect</button> </div>}
                    {isStreamed && 'On going call'}
                </span>
            </div>

            <div className="relative w-full h-[90vh] grid grid-cols-2 gap-2 py-5">
                <div className="flex items-center justify-center bg-gray-800">
                    {localStream && (
                        <video
                            autoPlay
                            muted
                            ref={video => {
                                if (video) {
                                    video.srcObject = localStream
                                }
                            }}
                            style={{ height: '340px', width: '420px' }}
                        />
                    )}
                </div>

                <div className="flex items-center justify-center bg-gray-900">
                    {remoteStream && (
                        <video
                            autoPlay
                            ref={video => {
                                if (video) {
                                    video.srcObject = remoteStream
                                }
                            }}
                            style={{ height: '340px', width: '420px' }}
                        />
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center py-5">
                <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
                    <MdOutlineCallEnd onClick={endCall} className="cursor-pointer text-3xl" />
                </div>
            </div>
        </div>
    )
}
