import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const ADD_SESSION = 'session/add_session';
const REMOVE_SESSION = 'session/remove_session';


// const SET_USER = "session/setUser";
// const REMOVE_USER = "session/removeUser";

// const setUser = (user) => {
//   return {
//     type: SET_USER,
//     payload: user
//   };
// };

// const removeUser = () => {
//   return {
//     type: REMOVE_USER
//   };
// };

// export const login = (user) => async (dispatch) => {
//   const { credential, password } = user;
//   const response = await csrfFetch("/api/session", {
//     method: "POST",
//     body: JSON.stringify({
//       credential,
//       password
//     })
//   });
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };

// const initialState = { user: null };

// const sessionReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_USER:
//       return { ...state, user: action.payload };
//     case REMOVE_USER:
//       return { ...state, user: null };
//     default:
//       return state;
//   }
// };

// regular action creator
const addSession = (user) => {
  return {
    type: ADD_SESSION,
    user
  };
};

export const removeSession = () => {
  return {
    type: REMOVE_SESSION,
  }
}

// thunk action creator
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credential,
      password
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addSession(data.user));
    return response;
  }
}

export const logout = () => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  if (res.ok) {
    const result = await res.json();
    dispatch(removeSession())
    return result;
  }
}

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");

  if (response.ok) {
    const data = await response.json();
    dispatch(addSession(data.user));
    return response;
  }
  }

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password}),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addSession(data.user));
    return res;
  }
};

// reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SESSION: {
      const newState = {...state, user: action.user};
      return newState;
    }
    case REMOVE_SESSION: {
      return {...state, user: null }
    }
    default:
      return state;
  }
};

export default sessionReducer;