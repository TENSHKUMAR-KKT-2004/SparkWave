export const HOST = "http://localhost:8080"

const AUTH_ROUTE = `${HOST}/api/auth`
const MESSAGE_ROUTE = `${HOST}/api/messages`

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`
export const GET_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`

export const SEND_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/send-message`
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTE}/get-messages`
export const SEND_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/send-image-message`
export const SEND_AUDIO_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/send-audio-message`
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGE_ROUTE}/get-initial-contacts`
