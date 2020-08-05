import { userTypes } from '../types/users';
import { userService } from '../../api/users';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const userInfos = {
    getInfo: getInfo,
    getInfoById: getInfoById,
    getUserGenresInfoById: getUserGenresInfoById,
    getUserRolesInfoById: getUserRolesInfoById
    // delete: _delete
};

function getInfo() {
    return dispatch => {
        dispatch(request());

        userService.getInfo()
            .then(
                info => dispatch(success(info)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userTypes.GET_USER_INFO_REQUEST } }
    function success(info) { return { type: userTypes.GET_USER_INFO_SUCCESS, info } }
    function failure(error) { return { type: userTypes.GET_USER_INFO_FAILURE, error } }
}

function getInfoById(id) {
  return dispatch => {
      dispatch(request(id));

      userService.getInfoById(id)
          .then(
              user => dispatch(success(id)),
              error => dispatch(failure(id, error.toString()))
          );
  };

  function request(id) { return { type: userTypes.GET_USERID_INFO_REQUEST, id } }
  function success(id) { return { type: userTypes.GET_USERID_INFO_SUCCESS, id } }
  function failure(id, error) { return { type: userTypes.GET_USERID_INFO_FAILURE, id, error } }
}

function getUserGenresInfoById(id) {
    return dispatch => {
        dispatch(request(id));
  
        userService.getUserGenresInfoById(id)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userTypes.GET_USER_GENRES_INFO_REQUEST, id } }
    function success(list) { return { type: userTypes.GET_USER_GENRES_INFO_SUCCESS, list } }
    function failure(id, error) { return { type: userTypes.GET_USER_GENRES_INFO_FAILURE, id, error } }
}

function getUserRolesInfoById(id) {
    return dispatch => {
        dispatch(request(id));
  
        userService.getUserRolesInfoById(id)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userTypes.GET_USER_ROLES_INFO_REQUEST, id } }
    function success(list) { return { type: userTypes.GET_USER_ROLES_INFO_SUCCESS, list } }
    function failure(id, error) { return { type: userTypes.GET_USER_ROLES_INFO_FAILURE, id, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
// function _delete(id) {
//     return dispatch => {
//         dispatch(request(id));

//         userService.delete(id)
//             .then(
//                 user => dispatch(success(id)),
//                 error => dispatch(failure(id, error.toString()))
//             );
//     };

//     function request(id) { return { type: authenticationTypes.DELETE_REQUEST, id } }
//     function success(id) { return { type: authenticationTypes.DELETE_SUCCESS, id } }
//     function failure(id, error) { return { type: authenticationTypes.DELETE_FAILURE, id, error } }
// }