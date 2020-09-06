import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { usernameCheck } from './usernameCheck';
import { projectUsernameCheck } from './projectUsernameCheck';
import { emailCheck } from './emailCheck';
import { search } from './search';
import { searchProject } from './searchProject';
import { user } from './user';
import { project } from './project';
import { projects } from './projects';
import { profile } from './profile';
import { followedByMe } from './follow';
import { events } from './events';
import { notes } from './notes';
import { musicGenres } from './musicGenres';
import { roles } from './roles';

const rootReducer = combineReducers({
  authentication,
  usernameCheck,
  projectUsernameCheck,
  emailCheck,
  search,
  searchProject,
  user,
  project,
  projects,
  profile,
  followedByMe,
  events,
  notes,
  musicGenres,
  roles
});

export default rootReducer;