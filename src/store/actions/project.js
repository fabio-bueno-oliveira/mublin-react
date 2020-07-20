import { projectTypes } from '../types/project';
import { projectService } from '../../api/projects';

export const projectInfos = {
    getProjectInfo: getProjectInfo,
    getProjectMembers: getProjectMembers,
    getProjectOpportunities: getProjectOpportunities
};

function getProjectInfo(username) {
  return dispatch => {
      dispatch(request(username));

      projectService.getProjectInfo(username)
          .then(
              info => dispatch(success(info)),
              error => dispatch(failure(username, error.toString()))
          );
  };

  function request(username) { return { type: projectTypes.GET_PROJECT_INFO_REQUEST, username } }
  function success(info) { return { type: projectTypes.GET_PROJECT_INFO_SUCCESS, info } }
  function failure(username, error) { return { type: projectTypes.GET_PROJECT_INFO_FAILURE, username, error } }
}

function getProjectMembers(username) {
    return dispatch => {
        dispatch(request(username));
  
        projectService.getProjectMembers(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: projectTypes.GET_PROJECT_MEMBERS_REQUEST, username } }
    function success(list) { return { type: projectTypes.GET_PROJECT_MEMBERS_SUCCESS, list } }
    function failure(username, error) { return { type: projectTypes.GET_PROJECT_MEMBERS_FAILURE, username, error } }
}

function getProjectOpportunities(username) {
    return dispatch => {
        dispatch(request(username));
  
        projectService.getProjectOpportunities(username)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: projectTypes.GET_PROJECT_OPPORTUNITIES_REQUEST, username } }
    function success(list) { return { type: projectTypes.GET_PROJECT_OPPORTUNITIES_SUCCESS, list } }
    function failure(username, error) { return { type: projectTypes.GET_PROJECT_OPPORTUNITIES_FAILURE, username, error } }
}