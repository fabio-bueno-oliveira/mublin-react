import { projectTypes } from '../types/project';

const initialState = {
  requesting: false,
  id: '',
  name: '',
  oldName: '',
  username: '',
  picture: '',
  created: '',
  foundationYear: '',
  endDate: '',
  bio: '',
  purpose: '',
  spotifyUri: '',
  typeId: '',
  typeName: '',
  genre1: '',
  genre2: '',
  genre3: '',
  country: '',
  region: '',
  city: '',
  labelShow: '',
  labelText: '',
  labelColor: '',
  public: '',
  members: [
    {
      id: '',
      joinedIn: '',
      name: '',
      lastname: '',
      username: '',
      picture: '',
      bio: '',
      role1: '',
      role2: '',
      role3: '',
      projectId: '',
      projectName: '',
      projectUsername: '',
      statusId: '',
      statusName: '',
      statusIcon: ''
    }
  ],
  opportunities: [
    {
      created: '',
      rolename: '',
      info: '',
      experienceLevel: '',
      experienceName: ''
    }
  ],
}

export function project(state = initialState, action) {
  switch (action.type) {
    case projectTypes.GET_PROJECT_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        id: action.info.id,
        name: action.info.name,
        oldName: action.info.oldName,
        username: action.info.username,
        picture: action.info.picture,
        created: action.info.created,
        foundationYear: action.info.foundationYear,
        endDate: action.info.endDate,
        bio: action.info.bio,
        purpose: action.info.purpose,
        spotifyUri: action.info.spotifyUri,
        typeId: action.info.typeId,
        typeName: action.info.typeName,
        genre1: action.info.genre1,
        genre2: action.info.genre2,
        genre3: action.info.genre3,
        country: action.info.country,
        region: action.info.region,
        city: action.info.city,
        labelShow: action.info.labelShow,
        labelText: action.info.labelText,
        labelColor: action.info.labelColor,
        public: action.info.public
      };
    case projectTypes.GET_PROJECT_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    case projectTypes.GET_PROJECT_MEMBERS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_MEMBERS_SUCCESS:
      return {
        ...state,
        requesting: false,
        members: action.list,
      };
    case projectTypes.GET_PROJECT_MEMBERS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    case projectTypes.GET_PROJECT_OPPORTUNITIES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_OPPORTUNITIES_SUCCESS:
      return {
        ...state,
        requesting: false,
        opportunities: action.list,
      };
    case projectTypes.GET_PROJECT_OPPORTUNITIES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}