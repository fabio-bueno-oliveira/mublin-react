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
  regionName: '',
  city: '',
  cityName: '',
  picture: '',
  plan: '',
  public: '',
  instagram: '',
  phone: '',
  status: '',
  legend: '',
  website: '',
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
  ],
  availabilityStatus: '',
  availabilityItems: [
    { id: '', idItem: '', name: '' }
  ],
  availabilityItemsLoaded: false,
  availabilityFocus: ''
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
        regionName: action.info.regionName,
        city: action.info.city,
        cityName: action.info.cityName,
        picture: action.info.picture,
        plan: action.info.plan,
        public: action.info.public,
        instagram: action.info.instagram,
        phone: action.info.phone,
        status: action.info.status,
        legend: action.info.legend_badge,
        website: action.info.website,
        availabilityStatus: action.info.availability_status,
        availabilityFocus: action.info.availability_focus
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
    // get user´s availability items
    case userTypes.GET_USER_AVAILABILITY_ITEMS_REQUEST:
      return {
        ...state,
        requesting: true,
        availabilityItemsLoaded: false
      };
    case userTypes.GET_USER_AVAILABILITY_ITEMS_SUCCESS:
      return {
        ...state,
        requesting: false,
        availabilityItems: action.list,
        availabilityItemsLoaded: true
      };
    case userTypes.GET_USER_AVAILABILITY_ITEMS_FAILURE:
      return {
        ...state,
        requesting: false,
        availabilityItemsLoaded: false,
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