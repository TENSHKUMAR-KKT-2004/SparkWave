import { reducerCases } from "./constants"

export const initialState = {
    userInfo: undefined,
    newUser: false,
    onBoarded: false,
    contactsPage: false,
    currentChatUser: undefined,
    messages: [],
    socket: undefined,
    messagesSearch: false,
    userContacts: [],
    onlineUsers: [],
    filteredContacts: [],
    videoCall: undefined,
    voiceCall: undefined,
    incomingVoiceCall: undefined,
    incomingVideoCall: undefined
}

export const reducer = (state, action) => {
    switch (action.type) {
        case reducerCases.SET_NEW_USER:
            return {
                ...state,
                newUser: action.newUser,
            }

        case reducerCases.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
                onBoarded: action.onBoarded
            }

        case reducerCases.SET_ALL_CONTACTS_PAGE:
            return {
                ...state,
                contactsPage: !state.contactsPage
            }

        case reducerCases.CHANGE_CURRENT_CHAT_USER:
            return {
                ...state,
                currentChatUser: action.user
            }

        case reducerCases.SET_MESSAGES:
            return {
                ...state,
                messages: action.messages
            }

        case reducerCases.SET_SOCKET:
            return {
                ...state,
                socket: action.socket
            }

        case reducerCases.ADD_NEW_MESSAGE:
            return {
                ...state,
                messages: [...(state.messages || []), action.newMessage],
            }

        case reducerCases.UPDATE_USER_CONTACTS:
            const { newMessage, fromSelf, user, } = action;

            // Update the chat list
            const updatedContacts = state.userContacts.map(contact => {
                if (contact.id === newMessage.senderId || contact.id === newMessage.recieverId) {
                    return {
                        ...contact,
                        messageId: newMessage.id,
                        type: newMessage.type,
                        messageStatus: newMessage.messageStatus,
                        senderId: newMessage.senderId,
                        recieverId: newMessage.recieverId,
                        message: newMessage.message,
                        createdAt: newMessage.createdAt,
                        totalUnreadMessages: contact.id === newMessage.senderId && !fromSelf
                            ? contact.totalUnreadMessages+1
                            : 0
                    }
                }
                return contact
            })

            // If the chat doesn't exist in the list, add it
            if (fromSelf && !updatedContacts.some(contact => contact.id === newMessage.recieverId)) {
                updatedContacts.push({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    profile_picture: user.profile_picture,
                    about: user.about,
                    totalUnreadMessages: 0,
                    messageId: newMessage.id,
                    type: newMessage.type,
                    messageStatus: newMessage.messageStatus,
                    senderId: newMessage.senderId,
                    recieverId: newMessage.recieverId,
                    message: newMessage.message,
                    createdAt: newMessage.createdAt,
                })
            }

            if (!fromSelf && !updatedContacts.some(contact => contact.id === newMessage.senderId)) {
                updatedContacts.push({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    profile_picture: user.profileImage,
                    about: user.about,
                    totalUnreadMessages: 1,
                    messageId: newMessage.id,
                    type: newMessage.type,
                    messageStatus: newMessage.messageStatus,
                    senderId: newMessage.senderId,
                    recieverId: newMessage.recieverId,
                    message: newMessage.message,
                    createdAt: newMessage.createdAt,
                })
            }

            return {
                ...state,
                userContacts: updatedContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            }

        case reducerCases.UPDATE_TOTAL_UNREAD_MESSAGES:
            return {
                ...state,
                userContacts: state.userContacts.map(contact =>
                    contact.id === action.lastMessage.senderId
                        ? { ...contact, totalUnreadMessages: 0 }
                        : contact
                )
            }

        case reducerCases.UPDATE_MESSAGE_STATUS:
            const { userID } = action

            const updatedMessages = Array.isArray(state.messages) ? state.messages.map(msg => {
                if (msg.recieverId === userID.chatUser && msg.messageStatus !== 'read') {
                    return { 
                        ...msg, 
                        messageStatus: 'read' 
                    }
                }
                return msg
            }) : state.messages
        
            // Update the userContacts state if the userID matches and there are unread messages
            const updateContacts = state.userContacts.map(contact => {
                if (contact.id === userID.chatUser) {
                    return {
                        ...contact,
                        messageStatus: 'read',
                        // totalUnreadMessages: 0
                    }
                }
                return contact
            })

            return {
                ...state,
                messages: updatedMessages,
                userContacts: updateContacts
            }
            
        case reducerCases.SET_MESSAGE_SEARCH:
            return {
                ...state,
                messagesSearch: !state.messagesSearch
            }

        case reducerCases.SET_ONLINE_USERS:
            return {
                ...state,
                onlineUsers: action.onlineUsers
            }

        case reducerCases.SET_USER_CONTACTS:
            return {
                ...state,
                userContacts: action.userContacts
            }

        case reducerCases.SET_CONTACT_SEARCH:
            const filterContacts = state.userContacts.filter((contact) => contact.name.toLowerCase().includes(action.contactSearch.toLowerCase()))
            return {
                ...state,
                contactSearch: action.contactSearch,
                filteredContacts: filterContacts
            }

        case reducerCases.SET_VOICE_CALL:
            return {
                ...state,
                voiceCall: action.voiceCall
            }

        case reducerCases.SET_VIDEO_CALL:
            return {
                ...state,
                videoCall: action.videoCall
            }

        case reducerCases.END_CALL:
            return {
                ...state,
                voiceCall: undefined,
                videoCall: undefined,
                incomingVideoCall: undefined,
                incomingVoiceCall: undefined
            }

        case reducerCases.SET_INCOMING_VOICE_CALL:
            return {
                ...state,
                incomingVoiceCall: action.incomingVoiceCall
            }

        case reducerCases.SET_INCOMING_VIDEO_CALL:
            return {
                ...state,
                incomingVideoCall: action.incomingVideoCall
            }

        case reducerCases.SET_EXIT_CHAT:
            return {
                ...state,
                currentChatUser: undefined,
                message: []
            }

        default:
            return state
    }
}