import {
  RESTORE_TOKEN,
  REGISTER_USER,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SEARCH_USER,
  SEARCH_USER_ERROR,
  SEARCH_USER_FOUND,
  DELETE_ERROR
} from "./types";

const host = "192.168.0.100";

export const restoreToken = dispatch => () => {
  dispatch({
    type: RESTORE_TOKEN
  });
};

export const register = dispatch => (username, password) => {
  dispatch({
    type: REGISTER_USER
  });

  fetch(`http://${host}:3000/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(response => {
      if (response.status === 200) {
        dispatch({
          action: REGISTER_SUCCESS
        });
        return;
      }
      response.json();
    })
    .then(data => {
      if (data.message === "USERNAME_TAKEN") {
        dispatch({
          type: REGISTER_FAIL,
          payload: "Username was already taken, Try another one."
        });
      } else {
        dispatch({
          type: REGISTER_FAIL,
          payload: data.message
        });
      }
      return;
    })
    .catch(err => {
      dispatch({
        type: REGISTER_FAIL,
        payload:
          "Unable to reach the server... :(\nCheck your internet connection"
      });
    });
};

export const login = dispatch => (username, password) => {
  dispatch({
    type: LOGIN_USER
  });
  fetch(`http://${host}:3000/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data.token
        });
      } else {
        dispatch({
          type: LOGIN_FAIL,
          payload: data.message
        });
      }
    })
    .catch(err => {
      dispatch({
        type: LOGIN_FAIL,
        payload:
          "Unable to reach the server... :(\nCheck your internet connection"
      });
    });
};

export const logout = dispatch => () => {
  dispatch({
    action: LOGOUT
  });
};

export const search = dispatch => (username, token) => {
  dispatch({
    action: SEARCH_USER
  });
  fetch(`http://${host}:3000/search?username=${username}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        dispatch({
          action: SEARCH_USER_ERROR,
          payload: "No users were found..."
        });
      } else {
        dispatch({
          action: SEARCH_USER_FOUND,
          payload: data
        });
      }
    })
    .catch(err => {
      dispatch({
        action: SEARCH_USER_ERROR,
        payload:
          "Unable to reach the server... :(\nCheck your internet connection"
      });
    });
};

export const deleteError = dispatch => () => {
  dispatch({
    type: DELETE_ERROR
  });
};
