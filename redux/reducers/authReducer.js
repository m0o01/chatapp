import {
  REGISTER_USER,
  REGISTER_SUCCESS,
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  DELETE_ERROR,
  LOGIN_FAIL,
  SEARCH_USER,
  SEARCH_USER_FOUND,
  SEARCH_USER_ERROR,
  RESTORE_TOKEN
} from "../actions/types";

const initalState = {
  logged: null,
  token: "",

  registering: false,
  logging: false,

  searching: false,
  results: [],

  error: false,
  errorMessage: ""
};

export default function authReducer(state = initalState, action) {
  switch (action.type) {
    case RESTORE_TOKEN:
      return {
        ...state,
        logged: state.token ? true : false
      };
    case REGISTER_USER:
      return {
        ...state,
        registering: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registering: false
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registering: false,
        error: true,
        errorMessage: action.payload
      };

    case LOGIN_USER:
      return {
        ...state,
        logging: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        logged: true,
        token: action.payload,
        logging: false
      };
    case LOGIN_FAIL:
      return {
        ...state,
        logging: false,
        error: true,
        errorMessage: action.payload
      };

    case SEARCH_USER:
      return {
        ...state,
        searching: true
      };
    case SEARCH_USER_FOUND:
      return {
        ...state,
        searching: false,
        results: action.payload
      };

    case SEARCH_USER_ERROR:
      return {
        ...state,
        searching: false,
        error: true,
        errorMessage: action.payload
      };

    case LOGOUT:
      return {
        ...state,
        logged: null,
        token: ""
      };

    case DELETE_ERROR:
      return {
        ...state,
        error: false,
        errorMessage: ""
      };

    default:
      return state;
  }
}
