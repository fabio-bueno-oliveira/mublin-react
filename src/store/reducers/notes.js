import { notesTypes } from '../types/notes';

const initialState = {
  requesting: false,
  list: [
    {
      noteId: '',
      noteCreated: '',
      ownerId: '',
      projectId: '',
      noteTitle: '',
      noteDescription: '',
      noteTargetDate: '',
      ownerName: '',
      ownerPicture: '',
      ownerUsername: '',
      projectName: '',
      projectUsername: '',
      projectPicture: '' 
    }
  ]
}

export function notes(state = initialState, action) {
  switch (action.type) {
    case notesTypes.GET_USERS_NOTES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case notesTypes.GET_USERS_NOTES_SUCCESS:
      return {
        ...state,
        list: action.list,
        requesting: false,
      };
    case notesTypes.GET_USERS_NOTES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}