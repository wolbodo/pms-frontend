import _ from 'lodash';
import Immutable from 'immutable';

import { apiAction } from 'redux/apiWrapper';

import { CLEAR } from './clearState';

const initialState = Immutable.fromJS({
  loggedIn: false,
  fetching: false
});

const START = 'pms/auth/LOGIN_START';
const SUCCESS = 'pms/auth/LOGIN_SUCCESS';
const FAIL = 'pms/auth/LOGIN_FAIL';
const FORGOT_START = 'pms/auth/FORGOT_START';
const FORGOT_SUCCESS = 'pms/auth/FORGOT_SUCCESS';
const FORGOT_FAIL = 'pms/auth/FORGOT_FAIL';
const RESET_START = 'pms/auth/RESET_START';
const RESET_SUCCESS = 'pms/auth/RESET_SUCCESS';
const RESET_FAIL = 'pms/auth/RESET_FAIL';
const LOGOUT = 'pms/auth/LOGOUT';

export function login(username, password) {
  return apiAction({
    types: [START, SUCCESS, FAIL],
    uri: 'login',
    options: {
      body: {
        user: username,
        password
      }
    }
  });
}

export function passwordForgot(email) {
  return apiAction({
    types: [FORGOT_START, FORGOT_SUCCESS, FORGOT_FAIL],
    uri: 'password_forgot',
    options: {
      body: {
        email
      }
    }
  });
}

export function passwordReset(token, password) {
  return apiAction({
    types: [RESET_START, RESET_SUCCESS, RESET_FAIL],
    uri: 'password_reset',
    options: {
      body: {
        token, password
      }
    }
  });
}

export function logout() {
  return {
    type: LOGOUT
  };
}

const reducers = {

  [START]: (auth) =>
    auth.merge({
      loggedIn: false,
      fetching: true,
      error: undefined,
      success: undefined,
    }),
  [SUCCESS]: (auth, { data: { token, permissions, success } }) => {
    // get the userinfo from the token.
    const user = JSON.parse(
      atob(
        token
            .split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
      )
    );

    return auth.merge({
      loggedIn: true,
      fetching: false,
      token,
      permissions,
      user,
      error: undefined,
      success: {
        login: success,
      },
    });
  },
  [FAIL]: (auth, { error: { error } }) =>
    auth.merge({
      fetching: false,
      error: {
        login: error
      },
      success: undefined,
    }),

  [FORGOT_START]: (auth) =>
    auth.merge({
      fetching: true,
      error: undefined,
      success: undefined,
    }),
  [FORGOT_SUCCESS]: (auth, { data: { success } }) =>
    auth.merge({
      fetching: false,
      error: undefined,
      success: {
        forgot: success,
      },
    }),
  [FORGOT_FAIL]: (auth, { error: { error } }) =>
    auth.merge({
      fetching: false,
      error: {
        forgot: error
      },
      success: undefined,
    }),

  [RESET_START]: (auth) =>
    auth.merge({
      fetching: true,
      error: undefined,
      success: undefined,
    }),
  [RESET_SUCCESS]: (auth, { data: { success } }) =>
    auth.merge({
      fetching: false,
      error: undefined,
      success: {
        reset: success,
      },
    }),
  [RESET_FAIL]: (auth, { error: { error } }) =>
    auth.merge({
      fetching: false,
      error: {
        reset: error
      },
      success: undefined,
    }),

  [CLEAR]: () => initialState
};

export default (state = initialState, action) =>
  _.get(
    reducers,
    action.type,   // Get type reducer
    (_state) => _state // Default passtrough
  )(state, action);
