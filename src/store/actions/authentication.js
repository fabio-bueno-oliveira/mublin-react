import { authenticationTypes } from '../types/authentication';
import { userService } from '../../api/authentication';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const userActions = {
    login,
    logout,
    validate,
    register,
    getAll,
    delete: _delete
};

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/home');
                    window.location.href = window.location.href;
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(user) { return { type: authenticationTypes.LOGIN_REQUEST, user } }
    function success(user) { return { type: authenticationTypes.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: authenticationTypes.LOGIN_FAILURE, error } }
}

function validate (token) {
    return dispatch => {
        dispatch(request({ token }));

        userService.validate(token)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/login');
                    window.location.href = window.location.href;
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(user) { return { type: authenticationTypes.VALIDATE_REQUEST, user } }
    function success(user) { return { type: authenticationTypes.VALIDATE_SUCCESS, user } }
    function failure(error) { return { type: authenticationTypes.VALIDATE_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: authenticationTypes.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(user) { return { type: authenticationTypes.REGISTER_REQUEST, user } }
    function success(user) { return { type: authenticationTypes.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: authenticationTypes.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: authenticationTypes.GETALL_REQUEST } }
    function success(users) { return { type: authenticationTypes.GETALL_SUCCESS, users } }
    function failure(error) { return { type: authenticationTypes.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: authenticationTypes.DELETE_REQUEST, id } }
    function success(id) { return { type: authenticationTypes.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: authenticationTypes.DELETE_FAILURE, id, error } }
}