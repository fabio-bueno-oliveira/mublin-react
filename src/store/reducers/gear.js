import { gearTypes } from '../types/gear';

const initialState = {
  requesting: false,
  brands: [
    { id: '', name: '', logo: '' }
  ]
}

export function gear(state = initialState, action) {
  switch (action.type) {
    case gearTypes.GET_GEAR_BRANDS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case gearTypes.GET_GEAR_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.list,
        requesting: false,
      };
    case gearTypes.GET_GEAR_BRANDS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}