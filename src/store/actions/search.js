import { searchTypes } from '../types/search';
import { searchService } from '../../api/search';

export const searchInfos = {
    getSearchResults: getSearchResults
};

function getSearchResults(query) {
    return dispatch => {
        dispatch(request(query));

        searchService.getSearchResults(query)
            .then(
                results => dispatch(success(results)),
                error => dispatch(failure(query, error.toString()))
            );
        };

    function request(query) { return { type: searchTypes.GET_SEARCH_RESULTS_REQUEST, query } }
    function success(results) { return { type: searchTypes.GET_SEARCH_RESULTS_SUCCESS, results } }
    function failure(error) { return { type: searchTypes.GET_SEARCH_RESULTS_FAILURE, error } }
}