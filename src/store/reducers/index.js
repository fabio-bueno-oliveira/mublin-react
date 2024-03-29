import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { usernameCheck } from './usernameCheck';
import { projectUsernameCheck } from './projectUsernameCheck';
import { emailCheck } from './emailCheck';
import { notifications } from './notifications';
import { feed } from './feed';
import { search } from './search';
import { searchProject } from './searchProject';
import { user } from './user';
import { userProjects } from './userProjects';
import { messages } from './messages';
import { project } from './project';
import { profile } from './profile';
import { followedByMe } from './follow';
import { events } from './events';
import { notes } from './notes';
import { musicGenres } from './musicGenres';
import { roles } from './roles';
import { gear } from './gear';
import { availabilityOptions } from './availabilityOptions';

const rootReducer = combineReducers({
  authentication,
  usernameCheck,
  projectUsernameCheck,
  emailCheck,
  notifications,
  feed,
  search,
  searchProject,
  user,
  userProjects,
  messages,
  project,
  profile,
  followedByMe,
  events,
  notes,
  musicGenres,
  roles,
  gear,
  availabilityOptions
});

export default rootReducer;