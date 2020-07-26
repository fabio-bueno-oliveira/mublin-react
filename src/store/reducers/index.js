import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { usernameCheck } from './usernameCheck';
import { emailCheck } from './emailCheck';
import { search } from './search';
import { user } from './users';
import { project } from './project';
import { projects } from './projects';
import { profile } from './profile';
import { events } from './events';

const rootReducer = combineReducers({
  authentication,
  usernameCheck,
  emailCheck,
  search,
  user,
  project,
  projects,
  profile,
  events
});

export default rootReducer;