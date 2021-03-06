import { notificationsTypes } from '../types/notifications';
import { feedTypes } from '../types/feed';
import { musicGenresTypes } from '../types/musicGenres';
import { rolesTypes } from '../types/roles';
import { gearTypes } from '../types/gear';
import { availabilityOptionsTypes } from '../types/availabilityOptions';
import { miscService } from '../../api/misc';

export const miscInfos = {
    getNotifications: getNotifications,
    getFeed: getFeed,
    getMusicGenres: getMusicGenres,
    getRoles: getRoles,
    getGearBrands: getGearBrands,
    getAvailabilityStatuses: getAvailabilityStatuses,
    getAvailabilityItems: getAvailabilityItems,
    getAvailabilityFocuses: getAvailabilityFocuses
};

function getFeed() {
    return dispatch => {
        dispatch(request());
  
        miscService.getFeed()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: feedTypes.GET_USER_FEED_REQUEST} }
    function success(list) { return { type: feedTypes.GET_USER_FEED_SUCCESS, list } }
    function failure(error) { return { type: feedTypes.GET_USER_FEED_FAILURE, error } }
}

function getNotifications() {
    return dispatch => {
        dispatch(request());
  
        miscService.getNotifications()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: notificationsTypes.GET_USER_NOTIFICATIONS_REQUEST} }
    function success(list) { return { type: notificationsTypes.GET_USER_NOTIFICATIONS_SUCCESS, list } }
    function failure(error) { return { type: notificationsTypes.GET_USER_NOTIFICATIONS_FAILURE, error } }
}

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

function getGearBrands() {
    return dispatch => {
        dispatch(request());
  
        miscService.getAllGearBrands()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: gearTypes.GET_GEAR_BRANDS_REQUEST} }
    function success(list) { return { type: gearTypes.GET_GEAR_BRANDS_SUCCESS, list } }
    function failure(error) { return { type: gearTypes.GET_GEAR_BRANDS_FAILURE, error } }
}

function getAvailabilityStatuses() {
    return dispatch => {
        dispatch(request());
  
        miscService.getAvailabilityStatuses()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: availabilityOptionsTypes.GET_AVAILABILITY_STATUSES_REQUEST} }
    function success(list) { return { type: availabilityOptionsTypes.GET_AVAILABILITY_STATUSES_SUCCESS, list } }
    function failure(error) { return { type: availabilityOptionsTypes.GET_AVAILABILITY_STATUSES_FAILURE, error } }
}

function getAvailabilityItems() {
    return dispatch => {
        dispatch(request());
  
        miscService.getAvailabilityItems()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: availabilityOptionsTypes.GET_AVAILABILITY_ITEMS_REQUEST} }
    function success(list) { return { type: availabilityOptionsTypes.GET_AVAILABILITY_ITEMS_SUCCESS, list } }
    function failure(error) { return { type: availabilityOptionsTypes.GET_AVAILABILITY_ITEMS_FAILURE, error } }
}

function getAvailabilityFocuses() {
    return dispatch => {
        dispatch(request());
  
        miscService.getAvailabilityFocuses()
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(error.toString()))
            );
        };
  
    function request() { return { type: availabilityOptionsTypes.GET_AVAILABILITY_FOCUSES_REQUEST} }
    function success(list) { return { type: availabilityOptionsTypes.GET_AVAILABILITY_FOCUSES_SUCCESS, list } }
    function failure(error) { return { type: availabilityOptionsTypes.GET_AVAILABILITY_FOCUSES_FAILURE, error } }
}