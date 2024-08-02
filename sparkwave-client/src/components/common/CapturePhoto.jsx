import React, { useRef, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'

export default function CapturePhoto({ setImage, hide }) {
    const videoRef = useRef(null)

    useEffect(() => {
        let stream
        const startCamara = async () => {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            videoRef.current.srcObject = stream
        }
        startCamara()

        return () => {
            stream?.getTracks().forEach(track => {
                track.stop()
            });
        }

    }, [])

    const capturePhoto = async () => {
        const hasWebcam = await checkWebcamAvailability()
        if (!hasWebcam) {
            alert("No webcam detected")
            hide(false)
            return
        }

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext('2d')

        if (ctx) {
            canvas.width = 300
            canvas.height = 150
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
            setImage(canvas.toDataURL("image/jpeg"))
            hide(false)
        } else {
            console.error("fail in canvas context creation")
        }
    }

    const checkWebcamAvailability = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            return devices.some(device => device.kind === 'videoinput')
        } catch (error) {
            console.error('Error in webcam availability:', error)
            return false
        }
    };

    return (
        <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex justify-center items-center">
            <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="pt-2 pr-2 cursor-pointer flex items-end justify-end"
                    onClick={() => hide(false)}>
                    <IoClose className="h-10 w-10 cursor-pointer" alt="close photo library" />
                </div>
                <div className="flex justify-center">
                    <video id="video" width="300" autoPlay ref={videoRef}>

                    </video>
                </div>
                <button
                    className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
                    onClick={capturePhoto}
                >

                </button>
            </div>
        </div>
    )
}
