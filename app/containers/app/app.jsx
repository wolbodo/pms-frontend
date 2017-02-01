import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Menu, Container, Dropdown } from 'semantic-ui-react';
import { push } from 'react-router-redux';

import logo from 'img/logo.svg'; // eslint-disable-line

import * as peopleActions from 'redux/modules/people';
import * as rolesActions from 'redux/modules/roles';
import * as fieldsActions from 'redux/modules/fields';

@connect(
  (state) => ({
    auth: state.get('auth').toJS(),
    people: state.get('people').toJS(),
  }), {
    pushState: push,
    peopleFetch: peopleActions.fetch,
    rolesFetch: rolesActions.fetch,
    fieldsFetch: fieldsActions.fetch,
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
    peopleFetch: PropTypes.func,
    rolesFetch: PropTypes.func,
    fieldsFetch: PropTypes.func,
  }

  static userMenu = [
    { key: 'wijzig', path: '/wijzig', text: 'Wijzig gegevens' },
    { key: 'logout', path: '/logout', text: 'Log uit' },
  ]

  static globalMenu = [
    { key: 'mensen', path: '/mensen/member', text: 'Mensen', active: '/mensen' },
    { key: 'velden', path: '/velden/people', text: 'Velden', active: '/velden' },
    { key: 'groepen', path: '/groepen', text: 'Groepen', active: '/groepen' },
    { key: 'permissies', path: '/permissies', text: 'Permissies', active: '/permissies' },
  ]

  constructor(props) {
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);

    this.state = { infoOpen: false };
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
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
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      screen: {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      }
    });
  }

  renderBase(menu, main) {
    return (
      <div className="app">
        {menu}
        <Container>
          {main}
        </Container>
      </div>
    );
  }

  render() {
    const {
      pushState, main, auth, people,
      peopleFetch, rolesFetch, fieldsFetch,
    } = this.props;
    const { screen } = this.state;

    if (!auth.loggedIn) {
      return this.renderBase(null, main);
    }
    const user = _.get(people, ['items', _.get(auth, 'user.user')], { nickname: 'User' });
    let menu;
    const size = (screen.width < 430) ? 'small' : 'normal';

    const userMenu = (
      <Dropdown.Menu>
        {App.userMenu.map((item) => (
          <Dropdown.Item onClick={() => pushState(item.path)} {...item} />

        ))}
      </Dropdown.Menu>
    );

    // only screen and (max-width: 767px)
    if (size === 'small') {
      // Render a dropdown
      menu = (
        <Dropdown item className="item" text="Menu" inverted>
          <Dropdown.Menu className="inverted menu" vertical>
            {App.globalMenu.map((item) => (
              <Dropdown.Item
                {...item}
                active={location.pathname.startsWith(item.active)}
                onClick={() => pushState(item.path)}
              />
            ))}
            <Dropdown item icon="user" className="item" text={user.nickname}>
              {userMenu}
            </Dropdown>
          </Dropdown.Menu>
        </Dropdown>
      );
    } else {
      menu = [
        App.globalMenu
        .map((item) => ({ ...item, name: item.text }))
        .map((item) => (
          <Menu.Item
            {...item}
            active={location.pathname.startsWith(item.active)}
            onClick={() => pushState(item.path)}
          />
        )), (
        <Menu.Item key="refresh"
          name="Refresh"
          onClick={() => {
            peopleFetch();
            rolesFetch();
            fieldsFetch();
          }}
        />
        ), (
        <Dropdown
          key="usermenu"
          className="right item"
          text={user.nickname}
          icon="user"
          position="right"
        >
          {userMenu}
        </Dropdown>
        )
      ];
    }

    menu = (
      <Menu inverted fixed="top">
        {menu}
      </Menu>
    );

    return this.renderBase(menu, main);
  }
}

