import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { user } from './users';
import { project } from './project'
import { projects } from './projects'
import { events } from './events'

const rootReducer = combineReducers({
  authentication,
  user,
  project,
  projects,
  events
});

export default rootReducer;