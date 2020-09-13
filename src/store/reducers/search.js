import { searchTypes } from '../types/search';

const initialState = {
  requesting: false,
  users: [
    {
      id: '',
      name: '',
      lastname: '',
      username: '',
      picture: '',
      publicProfile: '',
      plan: '',
      status: '',
      city: '',
      region: '',
      country: '',
      roleName: '',
      mainRole: '',
      projectRelated: '',
      projectType: '',
      availabilityStatus: '',
      availability_color: '',
      projects: [
        { id: '', name: '', username: '', picture: '' }
      ]
    }
  ],
  projects: [
    {
      id: '',
      name: '',
      username: '',
      picture: '',
      public: '',
      city: '',
      region: '',
      country: '',
      members: [
        { id: '', name: '', lastname: '', username: '', picture: '' }
      ]
    }
  ]
}

export function search(state = initialState, action) {
  switch (action.type) {
    // USERS
    case searchTypes.SEARCH_USERS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case searchTypes.SEARCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.results,
        requesting: false
      };
    case searchTypes.SEARCH_USERS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: 'Nenhum resultado encontrado'
      };
    // PROJECTS
    case searchTypes.SEARCH_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case searchTypes.SEARCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.results,
        requesting: false
      };
    case searchTypes.SEARCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [
          {
            id: '',
            name: '',
            username: '',
            picture: '',
            public: '',
            city: '',
            region: '',
            country: '',
            members: [
              { id: '', name: '', lastname: '', username: '', picture: '' }
            ]
          }
        ],
        requesting: false,
        error: 'Nenhum projeto encontrado'
      };
    default:
      return state
  }
}