import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as mdl from 'react-mdl';
import { Link } from 'react-router';

import * as peopleActions from 'redux/modules/people';
import * as groupsActions from 'redux/modules/groups';
import * as fieldsActions from 'redux/modules/fields';

// Action imports
import { push } from 'react-router-redux';

import logo from 'img/logo.svg'; // eslint-disable-line

@connect(
  (state) => ({
    auth: state.get('auth').toJS(),
    people: state.get('people').toJS(),
    fields: state.get('fields').toJS(),
    groups: state.get('groups').toJS()
  }), {
    pushState: push,
    peopleFetch: peopleActions.fetch,
    groupsFetch: groupsActions.fetch,
    fieldsFetch: fieldsActions.fetch
  })
export default class App extends React.Component {
  static propTypes = {
    main: PropTypes.element,
    header: PropTypes.element,

    auth: PropTypes.object,
    people: PropTypes.object,
    fields: PropTypes.object,
    groups: PropTypes.object,

    pushState: PropTypes.func,
    peopleFetch: PropTypes.func,
    groupsFetch: PropTypes.func,
    fieldsFetch: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0
    };

    this.handleTab = this.handleTab.bind(this);
    this.setPage = this.setPage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { auth,
      pushState, peopleFetch, groupsFetch, fieldsFetch } = this.props;
    if (!auth.loggedIn && nextProps.auth.loggedIn) {
      // login
      pushState('/');

      // Trigger fetch
      peopleFetch();
      groupsFetch();
      fieldsFetch();
    } else if (auth.loggedIn && !nextProps.auth.loggedIn) {
      // logout
      pushState('/login');
    }
  }

  setPage(page) {
    return () =>
      this.setState({
        currentPage: page
      });
  }

  handleTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const { main, header, auth } = this.props;

    return (
      <mdl.Layout fixedHeader fixedDrawer>
        <mdl.Header >
          <mdl.HeaderRow>
            {header}
          </mdl.HeaderRow>
        </mdl.Header>
        <mdl.Drawer>
          <header>
            <img src={logo} />
          </header>

          <mdl.Navigation>
            {auth.loggedIn ? [
              (<Link key="mensen" to="/mensen">Mensen</Link>),
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

