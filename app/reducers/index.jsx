import {combineReducers} from 'redux'
import { routeReducer } from 'redux-simple-router'


import fields from './fields'
import groups from './groups'
import auth from './auth'
import members from './members'
import permissions from './permissions'
import constants from 'constants'


const rootReducer = combineReducers({
	routing: routeReducer,
	fields,
	groups,
	auth,
	members,
	permissions
});

export default function (state, action) {
	if (action.type === constants.AUTH_LOGOUT_REQUEST) {
		// clear state.
		state = undefined
	}

	return rootReducer(state, action)
}