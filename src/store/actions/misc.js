import { musicGenresTypes } from '../types/musicGenres';
import { rolesTypes } from '../types/roles';
import { miscService } from '../../api/misc';

export const miscInfos = {
    getMusicGenres: getMusicGenres,
    getRoles: getRoles
};

function getMusicGenres() {
    return dispatch => {
        dispatch(request());
  
        miscService.getAllMusicGenres()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: musicGenresTypes.GET_MUSIC_GENRES_REQUEST} }
    function success(list) { return { type: musicGenresTypes.GET_MUSIC_GENRES_SUCCESS, list } }
    function failure(error) { return { type: musicGenresTypes.GET_MUSIC_GENRES_FAILURE, error } }
}

function getRoles() {
    return dispatch => {
        dispatch(request());
  
        miscService.getAllRoles()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: rolesTypes.GET_ROLES_REQUEST} }
    function success(list) { return { type: rolesTypes.GET_ROLES_SUCCESS, list } }
    function failure(error) { return { type: rolesTypes.GET_ROLES_FAILURE, error } }
}