import { messagesTypes } from '../types/messages';
import { userService } from '../../api/users';

export const messagesInfos = {
  getUserMessages: getUserMessages
};

function getUserMessages() {
    return dispatch => {
        dispatch(request());
  
        userService.getUserMessages()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request(id) { return { type: messagesTypes.GET_USERS_MESSAGES_REQUEST } }
    function success(list) { return { type: messagesTypes.GET_USERS_MESSAGES_SUCCESS, list } }
    function failure(error) { return { type: messagesTypes.GET_USERS_MESSAGES_FAILURE, error } }
}