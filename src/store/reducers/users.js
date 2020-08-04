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
    { id: '', name: '', description: '', instrumentalist: '' }
  ],
  genres: [
    { id: '', idGenre:'', name: '', mainGenre: '' }
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

    case userTypes.GET_USER_GENRE_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case userTypes.GET_USER_GENRE_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        genres: action.list
      };
    case userTypes.GET_USER_GENRE_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };

    default:
      return state
  }
}