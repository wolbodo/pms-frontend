import _ from 'lodash';
import React from 'react';
import { Route, IndexRoute } from 'react-router'

import {
	group,
	people,
	fields,
	permissions,
	Login,
	App,
	HeaderBar
} from 'containers'

import * as authActions from 'redux/modules/auth';
import clearState from 'redux/modules/clearState'

import {fetch as peopleFetch} from 'redux/modules/people';
import {fetch as groupsFetch} from 'redux/modules/groups';
import {fetch as fieldsFetch} from 'redux/modules/fields';


// Create a mapping for resourcetypes...
const actions = {
	people: peopleFetch,
	groups: groupsFetch,
	fields: fieldsFetch,
}
function fetchResources(store, ...resources) {
	return (nextState, replaceState) => {
		const state = store.getState()

		if (state.hasIn(['auth', 'token'])) {
			// User is logged in

			// TODO: Fetch correct resources
			_.each(resources, resource => {
				if (_.has(actions, resource)) {
					if (!state.getIn([resource, 'loaded']) || state.getIn([resource, 'fetching'])) {
						// fetch resource
						store.dispatch(actions[resource]());
					}
				}
			})
		}
	}
}

function requireLogin(store) {
  return (nextState, replaceState) => {
		const state = store.getState()

    if (!state.getIn(['auth', 'loggedIn'])) {
      replaceState('/login')
    }
  }
}

function logout(store) {
	return (nextState, replaceState) => {

    store.dispatch(authActions.logout())
    store.dispatch(clearState())
    
		replaceState('/login')
	}
} 

export default (store) => {
 return (
	<Route path="/" 
		component={App} 
		onEnter={fetchResources(store, 'people', 'groups', 'fields')}>
		<IndexRoute
			name='Lijst'
			components={{main: people.View, header: HeaderBar}}
			onEnter={requireLogin(store)}/>
		<Route
			name="Mensen"
			path="mensen(/:group_name)"
			components={{main: people.View, header: HeaderBar}}
			onEnter={requireLogin(store)}/>
		<Route
			name="Lid"
			path="lid-:id"
			components={{main: people.Edit, header: HeaderBar}}
			onEnter={requireLogin(store)} />
		<Route
			name="Wijzig"
			path="wijzig"
			components={{main: people.Edit, header: HeaderBar}}
			onEnter={requireLogin(store)} />
		<Route
			name="Velden"
			path="velden"
			components={{main: fields.View, header: HeaderBar}}
			onEnter={requireLogin(store)} />
		<Route
			name="Veld"
			path="velden/:veld"
			components={{main: fields.Edit, header: HeaderBar}}
			onEnter={requireLogin(store)} />
		<Route
			name="Groepen"
			path="groepen"
			components={{main: group.View, header: HeaderBar}}
			onEnter={requireLogin(store)} />
		<Route
			name="Groep"
			path="groepen/:groep"
			components={{main: group.Edit, header: HeaderBar}}
			onEnter={requireLogin(store)} />
		<Route
			name="Permissies"
			path="permissies"
			components={{main: permissions.View, header: HeaderBar}}
			onEnter={fetchResources(store, 'people', 'groups', 'fields', 'permissions')} />
		<Route
			name="Login"      
			path="login"          
			components={{main: Login}} />
		<Route
			name="Logout"
			path="logout"
			onEnter={logout(store)} />
	</Route>
 )
};