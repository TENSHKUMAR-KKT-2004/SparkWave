class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      })
    }
  }

  async getAnswer(offer) {
    try {
      if (this.peer.signalingState !== 'have-remote-offer') {
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer))
      }
      const ans = await this.peer.createAnswer()
      await this.peer.setLocalDescription(new RTCSessionDescription(ans))
      return ans
    } catch (error) {
      console.error('Error getting answer:', error)
    }
  }

  async setLocalDescription(ans) {
    try {
      if (this.peer.signalingState !== 'stable') {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
      }
    } catch (error) {
      console.error('Error setting local description:', error)
    }
  }

  async getOffer() {
    try {
      const offer = await this.peer.createOffer()
      await this.peer.setLocalDescription(new RTCSessionDescription(offer))
      return offer
    } catch (error) {
      console.error('Error getting offer:', error)
    }
  }
}

export default new PeerService()
