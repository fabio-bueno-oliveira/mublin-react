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
import { musicGenres } from './musicGenres'
import { roles } from './roles'

const rootReducer = combineReducers({
  authentication,
  usernameCheck,
  emailCheck,
  search,
  user,
  project,
  projects,
  profile,
  events,
  musicGenres,
  roles
});

export default rootReducer;