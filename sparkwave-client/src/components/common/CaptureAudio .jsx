import { useStateProvider } from '@/context/stateContext'
import React, { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'

export default function CaptureAudio({ hide }) {
    const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider()
    const [isRecording, setIsRecording] = useState(false)
    const [recordedAudio, setRecordedAudio] = useState(null)
    const [waveform, setWaveform] = useState(null)
    const [recordingDuration, setRecordingDuration] = useState(0)
    const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0)
    const [totalDuration, setTotalDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(0)

    const audioRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const waveformRef = useRef(null)

    useEffect(() => {

    }, [])

    const handlePlayRecording = () => {

    }

    const handleStopRecording = () => {

    }

    const handleStartRecording = ()=>{

    }

    const handlePauseRecording = ()=>{

    }

    const sendRecording = async()=> {
    
    }

    return (
        <div className="flex text-2xl w-full justify-end items-center">
            <div className="pt-1">
                <FaTrash
                    className="text-panel-header-icon cursor-pointer"
                    onClick={() => hide()}
                />
            </div>
            <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
                {
                    isRecording ? <div className="text-red-500 animate-pulse 2-60 text-center">
                        Recording... <span>{recordingDuration}s</span>
                    </div> :
                        <div>
                            {
                                recordedAudio &&
                                <>
                                    {
                                        !isPlaying ? <FaPlay onClick={handlePlayRecording} className="cursor-pointer" /> : <FaStop onClick={handlePauseRecording} className="cursor-pointer" />
                                    }
                                </>
                            }
                        </div>
                }
                <div className="w-60" ref={waveformRef} hidden={isRecording} />
                {
                    recordedAudio && isPlaying && <span>{formatTime(currentPlayBackTime)}</span>
                }
                {
                    recordedAudio && !isPlaying && <span>{formatTime(totalDuration)}</span>
                }
                <audio ref={audioRef} hidden />

                <div className="mr-4">
                    {
                        !isRecording ? 
                        <FaMicrophone 
                        className="text-red-500 cursor-pointer" 
                        onClick={handleStartRecording}
                        /> : 
                        <FaPauseCircle 
                        className="text-red-500 cursor-pointer" 
                        onClick={handleStopRecording}
                        />
                    }
                </div>
                <div>
                    <MdSend className="text-panel-header-icon cursor-pointer mr-4"
                    title='Send'
                    onClick={sendRecording}
                    />
                </div>
            </div>
        </div>
    )
}
