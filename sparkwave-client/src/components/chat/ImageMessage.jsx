import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HOST } from '@/utils/apiRoutes';
import { calculateTime } from '@/utils/calculateTime';
import MessageStatus from '../common/MessageStatus';
import Lightbox from 'yet-another-react-lightbox';
import { useStateProvider } from '@/context/stateContext'
import Download from "yet-another-react-lightbox/plugins/download"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Share from "yet-another-react-lightbox/plugins/share"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import 'yet-another-react-lightbox/styles.css'

const ImageMessage = ({ message }) => {
  const [{ currentChatUser, messages, userInfo }] = useStateProvider()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imageURLS, setImageURLS] = useState([])

  useEffect(() => {
    const imageUrls = messages
      .filter(msg => msg.type === 'image')
      .map(msg => ({ id: msg.id, src: `${HOST}/${msg.message}` }))

    const reorderedImageUrls = imageUrls.filter(img => img.id === message.id)
      .concat(imageUrls.filter(img => img.id !== message.id));

      console.log(reorderedImageUrls)
    setImageURLS(reorderedImageUrls)
  }, [messages])

  const handleOpenLightbox = () => setLightboxOpen(true)
  const handleCloseLightbox = () => setLightboxOpen(false)

  return (
    <>
      <div
        className={`p-1 rounded-lg ${message.senderId === currentChatUser.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}
        onClick={handleOpenLightbox}
      >
        <div className="relative">
          <Image
            src={`${HOST}/${message.message}`}
            className="rounded-lg cursor-pointer"
            alt="asset"
            height={300}
            width={300}
          />
          <div className="absolute bottom-1 right-1 flex items-end gap-1">
            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
              {calculateTime(message.createdAt)}
            </span>
            <span className="text-bubble-meta">
              {message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
            </span>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={handleCloseLightbox}
          slides={imageURLS.map(url => ({ src: url.src }))}
          render={{
            zoom: true,
            rotate: true
          }}
          plugins={[Download, Fullscreen, Share, Zoom]}
          animation={{ fade: 250, swipe: 500, easing: { fade: "ease", swipe: "ease-out", navigation: "ease-in-out" } }}
        />
      )}
    </>
  )
}

export default ImageMessage