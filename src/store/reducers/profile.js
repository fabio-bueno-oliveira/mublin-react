import { profileTypes } from '../types/profile';

const initialState = {
  requesting: false,
  id: '',
  name: '',
  lastname: '',
  email: '',
  picture: '',
  bio: '',
  country: '',
  region: '',
  city: '',
  roles: [
    { 
      id: '', 
      name: '',
      description: '',
      main: ''
    }
  ],
  availabilityId: '',
  availabilityTitle: '',
  availabilityColor: '',
  firstAccess: '',
  projects: {
    main: [
      {
        id: '', 
        name: '',
        username: '',
        typeId: '',
        typeName: '',
        mutual: false,
        genre1: '',
        genre2: '',
        genre3: '',
        members: [
          {
            id: '', 
            name: '',
            lastname: '',
            username: '',
            picture: '',
            role1: '',
            role2: '',
            role3: ''
          }
        ]
      }
    ],
    portfolio: [
      {
        id: '', 
        name: '',
        username: '',
        typeId: '',
        typeName: '',
        mutual: false,
        genre1: '',
        genre2: '',
        genre3: '',
        members: [
          {
            id: '', 
            name: '',
            lastname: '',
            username: '',
            picture: '',
            role1: '',
            role2: '',
            role3: ''
          }
        ]
      }
    ]
  },
  followers: [
    { 
      id: '', 
      name: '',
      lastname: '',
      username: '',
      picture: '',
      followedByMe: false
    }
  ],
  strengths: [
    { 
      title: '', 
      percentage: '',
      icon: ''
    }
  ],
  testimonials: [
    { 
      idUser: '',
      name: '',
      lastname: '',
      username: '',
      picture: '',
      date: '',
      title: '',
      testimonial: ''
    }
  ],
  plan: ''
}

export function profile(state = initialState, action) {
  switch (action.type) {
    case profileTypes.GET_PROFILE_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        id: action.info.id,
        name: action.info.name,
        lastname: action.info.lastname,
        email: action.info.email,
        picture: action.info.picture,
        bio: action.info.bio,
        country: action.info.country,
        region: action.info.region,
        city: action.info.city,
        availabilityId: action.info.availabilityId,
        availabilityTitle: action.info.availabilityTitle,
        availabilityColor: action.info.availabilityColor,
        firstAccess: action.info.firstAccess,
        plan: action.info.plan
      };
    case profileTypes.GET_PROFILE_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // MAIN PROJECTS
    case profileTypes.GET_PROFILE_MAIN_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_MAIN_PROJECTS_SUCCESS:
      return {
        ...state,
        mainProjects: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_MAIN_PROJECTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // PORTFOLIO PROJECTS
    case profileTypes.GET_PROFILE_PORTFOLIO_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_PORTFOLIO_PROJECTS_SUCCESS:
      return {
        ...state,
        portfolioProjects: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_PORTFOLIO_PROJECTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // ROLES
    case profileTypes.GET_PROFILE_ROLES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_ROLES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}