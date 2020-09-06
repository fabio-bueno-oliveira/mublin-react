import { userTypes } from '../types/users';

const initialState = {
  id: '',
  name: '',
  lastname: '',
  email: '',
  username: '',
  gender: '',
  bio: '',
  country: '',
  region: '',
  city: '',
  picture: '',
  payment_plan: '',
  roles: [
    { id: '', idRole: '', name: '', description: '', mainActivity: '' }
  ],
  genres: [
    { id: '', idGenre:'', name: '', mainGenre: '' }
  ],
  projects: [
    {
      id: '',
      id_user_fk: '',
      id_project_fk: '',
      confirmed: '',
      status: '',
      joined_in: '',
      main_role_fk: '',
      portfolio: '',
      created: '',
      projectid: '',
      name: '',
      username:'',
      type: '',
      picture: '',
      ptid: '',
      ptname: '',
      pticon: '',
      workTitle: '',
      workIcon: '',
      role1: '',
      role2: '',
      role3: '',
    }
  ]
}

export function user(state = initialState, action) {
  switch (action.type) {
    case userTypes.GET_USER_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case userTypes.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        id: action.info.id,
        name: action.info.name,
        lastname: action.info.lastname,
        email: action.info.email,
        username: action.info.username,
        gender: action.info.gender,
        bio: action.info.bio,
        country: action.info.country,
        region: action.info.region,
        city: action.info.city,
        picture: action.info.picture,
        payment_plan: action.info.payment_plan
      };
    case userTypes.GET_USER_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // get user´s preferred music genres
    case userTypes.GET_USER_GENRES_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case userTypes.GET_USER_GENRES_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        genres: action.list
      };
    case userTypes.GET_USER_GENRES_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // get user´s roles musicwise
    case userTypes.GET_USER_ROLES_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case userTypes.GET_USER_ROLES_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        roles: action.list
      };
    case userTypes.GET_USER_ROLES_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // get user´s projects
    case userTypes.GET_USER_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case userTypes.GET_USER_PROJECTS_SUCCESS:
      return {
        ...state,
        requesting: false,
        projects: action.list
      };
    case userTypes.GET_USER_PROJECTS_FAILURE:
      return {
        ...state,
        requesting: false,
        projects: [
          {
            id: '',
            id_user_fk: '',
            id_project_fk: '',
            confirmed: '',
            status: '',
            joined_in: '',
            main_role_fk: '',
            portfolio: '',
            created: '',
            projectid: '',
            name: '',
            username:'',
            type: '',
            picture: '',
            ptid: '',
            ptname: '',
            pticon: '',
            workTitle: '',
            workIcon: '',
            role1: '',
            role2: '',
            role3: '',
          }
        ],
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}