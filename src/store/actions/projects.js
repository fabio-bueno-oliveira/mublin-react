import { projectsTypes } from '../types/projects';
import { projectService } from '../../api/projects';

export const projectsInfos = {
    getUserMainProjects: getUserMainProjects,
    getUserPortfolioProjects: getUserPortfolioProjects
};

function getUserMainProjects(id) {
    return dispatch => {
        dispatch(request(id));
  
        projectService.getUserMainProjects(id)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(id, error.toString()))
            );
        };
  
    function request(id) { return { type: projectsTypes.GET_USERS_MAIN_PROJECTS_REQUEST, id } }
    function success(list) { return { type: projectsTypes.GET_USERS_MAIN_PROJECTS_SUCCESS, list } }
    function failure(error) { return { type: projectsTypes.GET_USERS_MAIN_PROJECTS_FAILURE, error } }
}

function getUserPortfolioProjects(id) {
    return dispatch => {
        dispatch(request(id));
  
        projectService.getUserPortfolioProjects(id)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(id, error.toString()))
            );
        };
  
    function request(id) { return { type: projectsTypes.GET_USERS_PORTFOLIO_PROJECTS_REQUEST, id } }
    function success(list) { return { type: projectsTypes.GET_USERS_PORTFOLIO_PROJECTS_SUCCESS, list } }
    function failure(error) { return { type: projectsTypes.GET_USERS_PORTFOLIO_PROJECTS_FAILURE, error } }
}