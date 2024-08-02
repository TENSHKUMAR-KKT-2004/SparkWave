export const HOST = "http://localhost:8080"

const AUTH_ROUTE = `${HOST}/api/auth`
const MESSAGE_ROUTE = `${HOST}/api/messages`

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`
export const SEND_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/send-message`