import { projectsTypes } from '../types/projects';

const initialState = {
  requesting: false,
  mainProjects: [
    { id: '', name: '' }
  ],
  portfolioProjects: [
    { id: '', name: '' }
  ]
}

export function projects(state = initialState, action) {
  switch (action.type) {
    // MAIN PROJECTS
    case projectsTypes.GET_USERS_MAIN_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectsTypes.GET_USERS_MAIN_PROJECTS_SUCCESS:
      return {
        ...state,
        mainProjects: action.list,
        requesting: false,
      };
    case projectsTypes.GET_USERS_MAIN_PROJECTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // PORTFOLIO PROJECTS
    case projectsTypes.GET_USERS_PORTFOLIO_PROJECTS_REQUEST:
        return {
          ...state,
          requesting: true
        };
    case projectsTypes.GET_USERS_PORTFOLIO_PROJECTS_SUCCESS:
        return {
          ...state,
          portfolioProjects: action.list,
          requesting: false,
        };
    case projectsTypes.GET_USERS_PORTFOLIO_PROJECTS_FAILURE:
        return {
          ...state,
          requesting: false,
          error: "A solicitação falhou"
        };
    default:
      return state
  }
}