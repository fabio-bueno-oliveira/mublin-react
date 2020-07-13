import { userTypes } from '../types/users';

const initialState = {
  id: '',
  name: '',
  lastname: '',
  email: '',
  picture: '',
  payment_plan: ''
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
        picture: action.info.picture,
        payment_plan: action.info.payment_plan
      };
    case userTypes.GET_USER_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}