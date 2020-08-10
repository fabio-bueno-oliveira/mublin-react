import { searchTypes } from '../types/search';

const initialState = {
  requesting: false,
  error: '',
  results: [
    {
      title: '', 
      description: '', 
      image: '', 
      price: ''
    }
  ],
  value: ''
}

export function searchProject(state = initialState, action) {
  switch (action.type) {
    case searchTypes.GET_SEARCHPROJECT_RESULTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case searchTypes.GET_SEARCHPROJECT_RESULTS_SUCCESS:
      return {
        //...state,
        results: action.results,
        requesting: false,
        error: '',
        value: '',
      };
    case searchTypes.GET_SEARCHPROJECT_RESULTS_FAILURE:
      return {
        state: state,
        requesting: false,
        error: 'Nenhum projeto encontrado'
      };
    default:
      return state
  }
}