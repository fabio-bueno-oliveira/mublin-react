import { eventsTypes } from '../types/projects';
import { eventService } from '../../api/projects';

export const eventsInfos = {
    getUserEvents: getUserEvents
};

function getUserEvents(id) {
    return dispatch => {
        dispatch(request(id));
  
        projectService.getUserEvents(id)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(id, error.toString()))
            );
        };
  
    function request(id) { return { type: projectsTypes.GET_USERS_MAIN_PROJECTS_REQUEST, id } }
    function success(list) { return { type: projectsTypes.GET_USERS_MAIN_PROJECTS_SUCCESS, list } }
    function failure(error) { return { type: projectsTypes.GET_USERS_MAIN_PROJECTS_FAILURE, error } }
}