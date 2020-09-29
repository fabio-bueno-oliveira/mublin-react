import { notificationsTypes } from '../types/notifications';

const initialState = {
  requesting: false,
  list: [
    { 
      id: '',
      seen: '',
      relatedItemId: '',
      extraText: '',
      extraInfo: '',
      created: '',
      relatedUserName: '',
      relatedUserLastname: '',
      relatedUserPicture: '',
      relatedUserUsername: '',
      relatedUserPlan: '',
      relatedProjectName: '',
      relatedProjectUsername: '',
      relatedProjectPicture: '',
      relatedProjectType: '',
      action: '',
      category: '',
      categoryId: '',
      relatedEventId: '',
      relatedEventTitle: '',
      likes: '',
      likedByMe: ''
    }
  ]
}

export function notifications(state = initialState, action) {
  switch (action.type) {
    case notificationsTypes.GET_USER_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case notificationsTypes.GET_USER_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        list: action.list,
        requesting: false,
      };
    case notificationsTypes.GET_USER_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        list: [
          { 
            id: '',
            itemId: '',
            extraText: '',
            extraInfo: '',
            created: '',
            relatedUserName: '',
            relatedUserLastname: '',
            relatedUserPicture: '',
            relatedUserUsername: '',
            relatedUserPlan: '',
            relatedProjectName: '',
            relatedProjectUsername: '',
            relatedProjectPicture: '',
            relatedProjectType: '',
            action: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}