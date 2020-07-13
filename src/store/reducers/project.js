import { projectTypes } from '../types/project';

const initialState = {
  id: '',
  name: '',
  picture: ''
}

export function project(state = initialState, action) {
  switch (action.type) {
    case projectTypes.GET_PROJECT_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        id: action.info.id,
        name: action.info.name,
        username: action.info.username,
        bio: action.info.bio,
        type: action.info.type,
        picture: action.info.picture
      };
    case projectTypes.GET_PROJECT_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    case projectTypes.GET_USERS_MAIN_PROJECTS_REQUEST:
      return {
        requesting: true
      };
    case projectTypes.GET_USERS_MAIN_PROJECTS_SUCCESS:
      return {
        payload: action,
        requesting: false,
      };
    case projectTypes.GET_USERS_MAIN_PROJECTS_FAILURE:
      return {
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}