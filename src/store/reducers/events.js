import { eventsTypes } from '../types/events';

const initialState = {
  requesting: false,
  events: [
    { id: '', title: '', description: '' }
  ]
}

export function events(state = initialState, action) {
  switch (action.type) {
    case eventsTypes.GET_USERS_EVENTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case eventsTypes.GET_USERS_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.list,
        requesting: false,
      };
    case eventsTypes.GET_USERS_EVENTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}