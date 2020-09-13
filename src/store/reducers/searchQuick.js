import { searchTypes } from '../types/search';

const initialState = {
  requesting: false,
  error: '',
  results: [
    {
      id: '', 
      title: '', 
      extra1: '', 
      extra2: '', 
      extra3: '',
      extra4: '',
      category: ''
    }
  ]
}

export function search(state = initialState, action) {
  switch (action.type) {
    case searchTypes.GET_SEARCH_RESULTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case searchTypes.GET_SEARCH_RESULTS_SUCCESS:
      return {
        //...state,
        results: action.results,
        requesting: false,
        error: ''
      };
    case searchTypes.GET_SEARCH_RESULTS_FAILURE:
      return {
        state: state,
        requesting: false,
        error: 'Nenhum resultado encontrado'
      };
    default:
      return state
  }
}