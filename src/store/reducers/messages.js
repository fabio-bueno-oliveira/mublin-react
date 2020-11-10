import { messagesTypes } from '../types/messages';

const initialState = {
  requesting: false,
  recentConversations: [
    { 
      lastMessageCreated: '',
      lastMessageCreatedFormatted: '',
      senderId: '',
      senderName: '',
      senderLastname: '',
      senderUsername: '',
      senderPicture: '',
      lastMessageId: '',
      receiverId: '',
      lastMessage: '',
      lastMessageSeen: ''
    }
  ]
}

export function messages(state = initialState, action) {
  switch (action.type) {
    case messagesTypes.GET_USERS_MESSAGES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case messagesTypes.GET_USERS_MESSAGES_SUCCESS:
      return {
        ...state,
        recentConversations: action.list,
        requesting: false,
      };
    case messagesTypes.GET_USERS_MESSAGES_FAILURE:
      return {
        ...state,
        recentConversations: [
          { 
            lastMessageCreated: '',
            lastMessageCreatedFormatted: '',
            senderId: '',
            senderName: '',
            senderLastname: '',
            senderUsername: '',
            senderPicture: '',
            lastMessageId: '',
            receiverId: '',
            lastMessage: '',
            lastMessageSeen: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}