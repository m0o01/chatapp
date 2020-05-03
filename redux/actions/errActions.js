import { DELETE_ERROR } from "./types";

export const deleteError = dispatch => () => {
  dispatch({
    type: DELETE_ERROR
  });
};
