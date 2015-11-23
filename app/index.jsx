import _ from 'lodash';

import React from 'react';
import ReactDOM from 'react-dom';
import mdl from 'react-mdl';

import {Router, Route, Link, IndexRoute, PropTypes } from 'react-router';
import { createHistory } from 'history';

import {auth, Login, Logout} from './auth';

import MembersList from './membersList';
import MemberEdit from './memberEdit';
import MemberCreate from './memberCreate';
import RolesEdit from './rolesEdit';
import EditPopup from './editPopup';

import ListView from './components/listView';

class HeaderBar extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(change) {
		// debugger;
	} 

	render() {


		debugger;
		return (
			<h3></h3>
		);
	}
}

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			currentPage: 0
		}

		this.handleTab = this.handleTab.bind(this);
		this.setPage = this.setPage.bind(this);
	}

	handleTab(tab) {
		this.setState({
			activeTab: tab
		});
	}

	setPage(page) {
		return () => 
			this.setState({
				currentPage: page
			});
	}

	render() {
		var {main, header} = this.props || {};
		return (
			<mdl.Layout fixedHeader fixedDrawer>
				<mdl.Header >
					<mdl.HeaderRow title="Wolbodo:ledenlijst">
						{ header }
					</mdl.HeaderRow>
				</mdl.Header>
				<mdl.Drawer>
					<header>
						<img src='/logo.svg' />
					</header>

					<mdl.Navigation>
						{auth.loggedIn() ? [
							(<Link key="leden" to="/">Leden</Link>),
							(<Link key="wijzig" to="/wijzig">Wijzig gegevens</Link>),
						 	(<Link key="velden" to="/velden">Velden</Link>),
						 	(<Link key="groepen" to="/groepen">Groepen</Link>),
						 	(<Link key="permissies" to="/permissies">Permissies</Link>),
			              	(<Link key="logout" to="/logout">Log uit</Link>)
			            ] : (
			              	<Link to="/login">Log in</Link>
			            )}
					</mdl.Navigation>
				</mdl.Drawer>
				<mdl.Content className="mdl-color--grey-100">
					{main}
				</mdl.Content>
			</mdl.Layout>

		);
	}
}

ReactDOM.render(
	<Router history={createHistory()}>
		<Route path="/" component={App}>
			<IndexRoute components={{main: MembersList}} onEnter={auth.require}/>
			<Route path="wijzig" components={{main: MemberCreate, header: HeaderBar}} onEnter={auth.require} />
			<Route path="velden" components={{main: MemberCreate, header: HeaderBar}} onEnter={auth.require} />
			<Route path="groepen" components={{main: GroupView, header: HeaderBar}} onEnter={auth.require}>
				<Route path="/:group_name" components={{main: GroupEdit, header: HeaderBar}} onEnter={auth.require} />
			</Route>
			<Route path="permissies" components={{main: MemberCreate, header: HeaderBar}} onEnter={auth.require} />
			<Route path="login" components={{main: Login}} />
			<Route path="logout" components={{main: Logout}} onEnter={auth.require} />
		</Route> 
	</Router>,
	document.getElementById('app')
);