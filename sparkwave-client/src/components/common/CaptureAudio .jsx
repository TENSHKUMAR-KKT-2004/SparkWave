import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/stateContext'
import { SEND_AUDIO_MESSAGE_ROUTE } from '@/utils/apiRoutes';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'
import WaveSurfer from 'wavesurfer.js';

export default function CaptureAudio({ hide }) {
    const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider()
    const [isRecording, setIsRecording] = useState(false)
    const [recordedAudio, setRecordedAudio] = useState(null)
    const [waveform, setWaveform] = useState(null)
    const [recordingDuration, setRecordingDuration] = useState(0)
    const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0)
    const [totalDuration, setTotalDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [renderedAudio, setRenderedAudio] = useState(null)

    const audioRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const waveformRef = useRef(null)

    useEffect(() => {
        let interval
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuration((prevDuration) => {
                    setTotalDuration(prevDuration + 1)
                    return prevDuration + 1
                })
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isRecording])

    useEffect(() => {
        const wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#ccc",
            progressColor: "#4a9eff",
            cursorColor: "#7ae3c3",
            barWidth: 2,
            height: 30,
            responsive: true
        })

        setWaveform(wavesurfer)

        wavesurfer.on("finish", () => {
            setIsPlaying(false)
        })

        return () => {
            wavesurfer.destroy()
        }
    }, [])

    useEffect(() => {
        if (waveform) {
            handleStartRecording()
        }
    }, [waveform])

    useEffect(() => {
        if (recordedAudio) {
            const updatePlaybackTime = () => {
                setCurrentPlayBackTime(recordedAudio.currentTime)
            }

            recordedAudio.addEventListener('timeupdate', updatePlaybackTime)

            return () => {
                recordedAudio.removeEventListener('timeupdate', updatePlaybackTime)
            }
        }
    }, [recordedAudio])

    const handlePlayRecording = () => {
        if (recordedAudio) {
            waveform.stop()
            waveform.play()
            recordedAudio.play()
            setIsPlaying(true)
        }
    }

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            waveform.stop()

            const audioChunks = []
            mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data)
            })

            mediaRecorderRef.current.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
                const audioFile = new File([audioBlob], "recording.wav")
                setRenderedAudio(audioFile)

                const audioURL = URL.createObjectURL(audioBlob)
                const audio = new Audio(audioURL)
                setRecordedAudio(audio)
                waveform.load(audioURL)
            })
        }
    }

    const handleStartRecording = () => {
        setRecordingDuration(0)
        setCurrentPlayBackTime(0)
        setTotalDuration(0)
        setIsRecording(true)
        setRecordedAudio(null)

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream)

            mediaRecorderRef.current = mediaRecorder
            audioRef.current.srcObject = stream

            const chunks = []
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
                const audioURL = URL.createObjectURL(blob)
                const audio = new Audio(audioURL)
                setRecordedAudio(audio)

                waveform.load(audioURL)
            }

            mediaRecorder.start()
        }).catch(err => {
            console.log(err)
        })
    }

    const handlePauseRecording = () => {
        waveform.stop()
        recordedAudio.pause()
        setIsPlaying(false)
    }

    const sendRecording = async () => {
        const formData = new FormData()
        formData.append('audio', renderedAudio)
        try {
            const res = await axios.post(SEND_AUDIO_MESSAGE_ROUTE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                params: {
                    from: userInfo.id,
                    to: currentChatUser.id
                }
            })

            if (res.status === 201) {
                socket.current.emit('send-message', {
                    to: currentChatUser.id,
                    from: userInfo.id,
                    message: res.data.message
                })

                dispatch({
                    type: reducerCases.ADD_NEW_MESSAGE,
                    newMessage: {
                        ...res.data.message
                    },
                    fromSelf: true
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const formatTime = (time) => {
        if (isNaN(time)) {
            return '00:00'
        }

        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    const handleDelete = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }

        if (recordedAudio) {
            recordedAudio.pause()
            setIsPlaying(false)
        }

        if (waveform) {
            waveform.stop()
            waveform.destroy()
            setWaveform(null)
        }

        if (audioRef.current) {
            audioRef.current.srcObject.getTracks().forEach(track => track.stop())
            audioRef.current.srcObject = null
        }

        hide()
    }


    return (
        <div className="flex text-2xl w-full justify-end items-center">
            <div className="pt-1">
                <FaTrash
                    className="text-panel-header-icon cursor-pointer"
                    onClick={handleDelete}
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
            </div>
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
    )
}
