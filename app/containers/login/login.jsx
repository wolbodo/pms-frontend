import React, { PropTypes } from 'react';
import { Grid, Form, Segment, Message } from 'semantic-ui-react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import * as authActions from 'redux/modules/auth';

import './login.less';

@connect(
  (state) => ({
    people: state.get('people').toJS(),
    auth: state.get('auth').toJS(),
  }), {
    login: authActions.login,
  })
class Login extends React.Component {
  static propTypes = {
    login: PropTypes.func,
    passwordForgot: PropTypes.func,
    auth: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      error: false
    };
  }

  handleSubmit(event, { formData: { email, password } }) {
    event.preventDefault();
    this.props.login(email, password);
  }

  render() {
    const { auth: { error, success } } = this.props;
    return (
      <Grid centered className="middle aligned">
        <Grid.Column>
          <h2>Log in.</h2>
          <Form onSubmit={(ev, data) => this.handleSubmit(ev, data)}>
            <Segment>
              <Form.Input
                icon="user"
                name="email"
                iconPosition="left"
                placeholder="Email address"
                type="email"
              />
              <Form.Input
                icon="privacy"
                name="password"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />
              <Form.Button content="login" fluid />
            </Segment>
          </Form>
          {error && error.login && <Message error content={error.login} />}
          {success && <Message success content={success.login || success.reset} />}
          <Message>
            Forgot your password? <Link to="/password_forgot">Click here.</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

const Forgot = connect((state) => ({
  auth: state.get('auth').toJS()
}), {
  passwordForgot: authActions.passwordForgot
})(({ passwordForgot, auth: { error, success } }) => (
  <Grid centered className="middle aligned">
    <Grid.Column>
      <h2>Reset your password.</h2>
      <Form onSubmit={(ev, { formData: { email } }) => {
        ev.preventDefault();
        passwordForgot(email);
      }}
      >
        <Segment>
          <Form.Input
            icon="user"
            name="email"
            iconPosition="left"
            placeholder="Email address"
            type="email"
          />
          <Form.Button content="Reset password" fluid />
        </Segment>
      </Form>
      {error && error.forgot && <Message error content={error.forgot} />}
      {success && success.forgot && <Message success content={success.forgot} />}
    </Grid.Column>
  </Grid>
));


const Reset = connect((state) => ({
  auth: state.get('auth').toJS()
}), {
  pushState: push,
  passwordReset: authActions.passwordReset,
})(({
  passwordReset,
  pushState,
  auth: { error, success },
  params: { token }
}) => {
  if (!(error && error.reset) && (success && success.reset)) {
    pushState('/login');
  }
  return (
    <Grid centered className="middle aligned">
      <Grid.Column>
        <h2>Set your new password.</h2>
        <Form onSubmit={(ev, { formData: { password } }) => {
          ev.preventDefault();
          passwordReset(token, password);
        }}
        >
          <Segment>
            <Form.Input
              icon="privacy"
              name="password"
              iconPosition="left"
              placeholder="Password"
              type="password"
            />
            <Form.Button content="Set new password" fluid />
          </Segment>
        </Form>
        {error && error.reset && <Message error content={error.reset} />}
        {success && success.reset && <Message success content={success.reset} />}
      </Grid.Column>
    </Grid>
  );
});

Login.Forgot = Forgot;
Login.Reset = Reset;
export default Login;
