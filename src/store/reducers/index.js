import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { usernameCheck } from './usernameCheck';
import { projectUsernameCheck } from './projectUsernameCheck';
import { emailCheck } from './emailCheck';
import { feed } from './feed';
import { search } from './search';
import { searchProject } from './searchProject';
import { user } from './user';
import { project } from './project';
import { profile } from './profile';
import { followedByMe } from './follow';
import { events } from './events';
import { notes } from './notes';
import { musicGenres } from './musicGenres';
import { roles } from './roles';
import { availabilityOptions } from './availabilityOptions';

const rootReducer = combineReducers({
  authentication,
  usernameCheck,
  projectUsernameCheck,
  emailCheck,
  feed,
  search,
  searchProject,
  user,
  project,
  profile,
  followedByMe,
  events,
  notes,
  musicGenres,
  roles,
  availabilityOptions
});

export default rootReducer;