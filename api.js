import { getToken } from "./StorageData";

export const registeration = async (username, password) => {
  try {
    const response = await fetch("http://192.168.0.103:3000/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (response.status === 200) {
      return "ok";
    } else {
      const error = await response.json();
      return error.message;
    }
  } catch (err) {
    return "Unable to reach the server... :(\nCheck your internet connection";
  }
};

export const login = async (username, password) => {
  try {
    const response = await fetch("http://192.168.0.103:3000/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (response.status === 200) {
      const token = await response.json();
      return { token };
    } else {
      const error = await response.json();
      return error.message;
    }
  } catch (err) {
    return "Unable to reach the server... :(\nCheck your internet connection";
  }
};

export const searchUser = async username => {
  const token = await getToken();
  try {
    const response = await fetch(
      `http://192.168.0.103:3000/search?username=${username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === 200) return await response.json();
    else return { error: "No users were found..." };
  } catch (err) {
    return {
      error: "Unable to reach the server... :(\nCheck your internet connection"
    };
  }
};
