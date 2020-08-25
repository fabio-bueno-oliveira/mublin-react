import { notesTypes } from '../types/notes';
import { notesService } from '../../api/notes';

export const notesInfos = {
    getUserNotes: getUserNotes
};

function getUserNotes(id) {
    return dispatch => {
        dispatch(request(id));

        notesService.getUserNotes(id)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(id, error.toString()))
            );
        };

    function request(id) { return { type: notesTypes.GET_USERS_NOTES_REQUEST, id } }
    function success(list) { return { type: notesTypes.GET_USERS_NOTES_SUCCESS, list } }
    function failure(error) { return { type: notesTypes.GET_USERS_NOTES_FAILURE, error } }
}