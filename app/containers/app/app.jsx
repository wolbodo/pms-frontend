import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as mdl from 'react-mdl';
// import { Link } from 'react-router';
import { Menu, Container, Dropdown } from 'semantic-ui-react';
// Action imports
import { push } from 'react-router-redux';

import logo from 'img/logo.svg'; // eslint-disable-line

@connect(
  (state) => ({
    auth: state.get('auth').toJS(),
    people: state.get('people').toJS(),
  }), {
    pushState: push,
  })
export default class App extends React.Component {
  static propTypes = {
    main: PropTypes.element,
    header: PropTypes.element,

    auth: PropTypes.object,
    people: PropTypes.object,
    fields: PropTypes.object,
    roles: PropTypes.object,

    pushState: PropTypes.func,
  }

  static userMenu = [
    { key: 'wijzig', path: '/wijzig', text: 'Wijzig gegevens' },
    { key: 'logout', path: '/logout', text: 'Log uit' },
  ]

  static globalMenu = [
    { key: 'mensen', path: '/mensen/member', name: 'Mensen' },
    { key: 'velden', path: '/velden', name: 'Velden' },
    { key: 'groepen', path: '/groepen', name: 'Groepen' },
    { key: 'permissies', path: '/permissies', name: 'Permissies' },
  ]

  constructor(props) {
    super(props);

    this.state = { infoOpen: false };
  }

  componentWillReceiveProps(nextProps) {
    const { auth, pushState } = this.props;

    // Auth flow
    if (!auth.loggedIn && nextProps.auth.loggedIn) {
      // login
      pushState('/');
    } else if (auth.loggedIn && !nextProps.auth.loggedIn) {
      // logout
      pushState('/login');
    }
  }

  render() {
    const { pushState, main, auth, people } = this.props;

    const self = people.items[auth.user.user];
    return (
      <div className="app">
        { auth.loggedIn && (
          <Menu inverted fixed="top" stackable>
            {App.globalMenu.map((item) => (
              <Menu.Item onClick={() => pushState(item.path)} {...item} />
            ))}

            <Dropdown className="right item" text={self.nickname} position="right">
              <Dropdown.Menu>
                <Dropdown.Header>{self.nickname}</Dropdown.Header>
                {App.userMenu.map((item) => (
                  <Dropdown.Item onClick={() => pushState(item.path)} {...item} />

                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu>
        )}
        <Container>
          {main}
        </Container>
      </div>
    );
  }
}

