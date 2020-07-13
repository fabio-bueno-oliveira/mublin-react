import { projectTypes } from '../types/project';
import { projectService } from '../../api/projects';

export const projectInfos = {
    getProjectInfo: getProjectInfo
};

function getProjectInfo(id) {
  return dispatch => {
      dispatch(request(id));

      projectService.getProjectInfo(id)
          .then(
              project => dispatch(success(id)),
              error => dispatch(failure(id, error.toString()))
          );
  };

  function request(id) { return { type: projectTypes.GET_USERID_INFO_REQUEST, id } }
  function success(id) { return { type: projectTypes.GET_USERID_INFO_SUCCESS, id } }
  function failure(id, error) { return { type: projectTypes.GET_USERID_INFO_FAILURE, id, error } }
}