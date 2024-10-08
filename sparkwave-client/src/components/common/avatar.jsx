import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { FaCamera } from 'react-icons/fa'
import ContextMenu from './ContextMenu'
import PhotoPicker from './PhotoPicker'
import PhotoLibrary from './PhotoLibrary'
import CapturePhoto from './CapturePhoto'
import { useStateProvider } from '@/context/stateContext'

export default function Avatar({ type, image, setImage }) {
    const [hover, setHover] = useState(false)
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
    const [contextMenuCo_ords, setContextMenuCo_ords] = useState({ x: 0, y: 0 })
    const [grabPhoto, setGrabPhoto] = useState(false)
    const [showPhotoLib, setShowPhotoLib] = useState(false)
    const [showCapturePhoto, setShowCapturePhoto] = useState(false)
    const [avatarSrc, setAvatarSrc] = useState('/default_avatar.png')

    useEffect(() => {
        if (image) {
            setAvatarSrc(image);
        }
    }, [image]);

    const photoPickerChange = async (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        const data = document.createElement("img")
        reader.onload = (event) => {
            data.src = event.target.result
            data.setAttribute("data-src", event.target.result)
        }
        reader.readAsDataURL(file)
        setTimeout(() => {
            setImage(data.src)
        }, 1000)
    }

    const showContextMenu = (e) => {
        e.preventDefault()
        setContextMenuCo_ords({ x: e.pageX, y: e.pageY })
        setIsContextMenuVisible(true)
    }

    useEffect(() => {
        if (grabPhoto) {
            const data = document.getElementById("photo-picker")
            data.click()
            document.body.onfocus = (e) => {
                setTimeout(() => {
                    setGrabPhoto(false)
                }, 1000)
            }
        }

    }, [grabPhoto])

    const contextMenuOptions = [
        {
            name: "Take Photo", callback: () => {
                setShowCapturePhoto(true)
            }
        },
        {
            name: "Choose From Library", callback: () => {
                setShowPhotoLib(true)
            }
        },
        {
            name: "Upload Photo", callback: () => {
                setGrabPhoto(true)
            }
        },
        {
            name: "Remove Photo", callback: () => {
                setImage("/default_avatar.png")
            }
        }
    ]

    return (
        <>
            <div className="flex items-center justify-center">
                {
                    type === "sm" &&
                    <div className="relative h-10 w-10">
                        <Image src={avatarSrc} alt="avatar" className="rounded-full" fill loading="lazy" />
                    </div>
                }

                {
                    type === "lg" &&
                    <div className="relative h-14 w-14">
                        <Image src={avatarSrc} alt="avatar" className="rounded-full" fill loading="lazy" />
                    </div>
                }

                {
                    type === "xl" &&
                    <div className="relative cursor-pointer z-0"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <div className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2
                        ${hover ? 'visible' : 'hidden'}
                        `}
                            id="context-opener"
                            onClick={e => showContextMenu(e)}
                        >
                            <FaCamera className="text-2xl"
                                id="context-opener"
                                onClick={e => showContextMenu(e)}
                            />
                            <span
                                onClick={e => showContextMenu(e)}
                                id="context-opener"
                            >Change <br /> profile <br /> picture</span>
                        </div>
                        <div className="h-60 w-60 flex items-center justify-center">
                            <Image src={avatarSrc} alt="avatar" className="rounded-full" fill loading="lazy" />
                        </div>
                    </div>
                }
            </div>
            {isContextMenuVisible && <ContextMenu
                options={contextMenuOptions}
                cordinates={contextMenuCo_ords}
                contextMenu={isContextMenuVisible}
                setContextMenu={setIsContextMenuVisible}
            />
            }

            {
                showCapturePhoto && <CapturePhoto
                    setImage={setImage}
                    hide={setShowCapturePhoto}
                />
            }

            {
                showPhotoLib && <PhotoLibrary setImage={setImage} hidePhotoLib={setShowPhotoLib} />
            }

            {
                grabPhoto && <PhotoPicker onChange={photoPickerChange} />
            }
        </>
    )
}
