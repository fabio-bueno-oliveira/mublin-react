import { profileTypes } from '../types/profile';
import { profileService } from '../../api/profile';

export const profileInfos = {
    getProfileInfo: getProfileInfo,
    getProfileProjects: getProfileProjects,
    getProfileRoles: getProfileRoles,
    getProfileFollowers: getProfileFollowers,
    getProfileFollowing: getProfileFollowing,
    checkProfileFollowing: checkProfileFollowing,
    getProfilePosts: getProfilePosts,
    getProfileGear: getProfileGear,
    getProfilePartners: getProfilePartners,
    getProfileStrengths: getProfileStrengths,
    getProfileStrengthsRaw: getProfileStrengthsRaw,
    getProfileAvailabilityItems: getProfileAvailabilityItems,
    getProfileTestimonials: getProfileTestimonials
};

function getProfileInfo(username) {
  return dispatch => {
      dispatch(request(username));

      profileService.getProfileInfo(username)
          .then(
              info => dispatch(success(info)),
              error => dispatch(failure(username, error.toString()))
          );
  };

  function request(username) { return { type: profileTypes.GET_PROFILE_INFO_REQUEST, username } }
  function success(info) { return { type: profileTypes.GET_PROFILE_INFO_SUCCESS, info } }
  function failure(username, error) { return { type: profileTypes.GET_PROFILE_INFO_FAILURE, username, error } }
}

function getProfileProjects(username) {
    return dispatch => {
        dispatch(request(username));
  
        profileService.getProfileProjects(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_PROJECTS_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_PROJECTS_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_PROJECTS_FAILURE, username, error } }
}

function getProfileRoles(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileRoles(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_ROLES_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_ROLES_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_ROLES_FAILURE, username, error } }
}

function getProfileFollowers(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileFollowers(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_FOLLOWERS_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_FOLLOWERS_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_FOLLOWERS_FAILURE, username, error } }
}

function getProfileFollowing(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileFollowing(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_FOLLOWING_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_FOLLOWING_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_FOLLOWING_FAILURE, username, error } }
}

function checkProfileFollowing(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.checkProfileFollowing(username)
            .then(
                info => dispatch(success(info)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_CHECKFOLLOWING_REQUEST, username } }
    function success(info) { return { type: profileTypes.GET_PROFILE_CHECKFOLLOWING_SUCCESS, info } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_CHECKFOLLOWING_FAILURE, username, error } }
}

function getProfilePosts(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfilePosts(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_POSTS_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_POSTS_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_POSTS_FAILURE, username, error } }
}

function getProfileGear(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileGear(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };

    function request(username) { return { type: profileTypes.GET_PROFILE_GEAR_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_GEAR_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_GEAR_FAILURE, username, error } }
}

function getProfilePartners(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfilePartners(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };

    function request(username) { return { type: profileTypes.GET_PROFILE_PARTNERS_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_PARTNERS_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_PARTNERS_FAILURE, username, error } }
}

function getProfileAvailabilityItems(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileAvailabilityItems(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_AVAILABILITYITEMS_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_AVAILABILITYITEMS_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_AVAILABILITYITEMS_FAILURE, username, error } }
}

function getProfileStrengths(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileStrengths(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_STRENGTHS_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_STRENGTHS_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_STRENGTHS_FAILURE, username, error } }
}

function getProfileStrengthsRaw(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileStrengthsRaw(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_STRENGTHS_RAW_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_STRENGTHS_RAW_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_STRENGTHS_RAW_FAILURE, username, error } }
}

function getProfileTestimonials(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.getProfileTestimonials(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: profileTypes.GET_PROFILE_TESTIMONIALS_REQUEST, username } }
    function success(list) { return { type: profileTypes.GET_PROFILE_TESTIMONIALS_SUCCESS, list } }
    function failure(username, error) { return { type: profileTypes.GET_PROFILE_TESTIMONIALS_FAILURE, username, error } }
}