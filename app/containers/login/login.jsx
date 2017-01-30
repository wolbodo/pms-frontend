import React, { PropTypes } from 'react';
import { Grid, Form, Segment, Message } from 'semantic-ui-react';

import { connect } from 'react-redux';
import * as authActions from 'redux/modules/auth';

import './login.less';

@connect(
  (state) => ({
    people: state.get('people').toJS(),
    auth: state.get('auth').toJS()
  }), {
    login: authActions.login,
    passwordForgot: authActions.passwordForgot
  })
export default class Login extends React.Component {
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
    debugger;

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
          {error && <Message error content={error} />}
          {success && <Message success content={success} />}
        </Grid.Column>
      </Grid>
    );

    // return (
    //   <form className="content" onSubmit={this.handleSubmit}>
    //     <mdl.Card className="login mdl-color--white mdl-shadow--2dp">
    //       <mdl.CardTitle>Log in!</mdl.CardTitle>
    //       <div className="mdl-card__form">
    //         <mdl.Textfield
    //           label="Email"
    //           onChange={({ target }) => this.onChange('email', target.value)}
    //           pattern=".+@.+"
    //           error="Input is not an emailaddress!"
    //           floatingLabel
    //         />
    //         <mdl.Textfield
    //           label="Wachtwoord"
    //           type="password"
    //           onChange={({ target }) => this.onChange('password', target.value)}
    //           floatingLabel
    //         />
    //         <mdl.Button primary raised>Log in</mdl.Button>
    //         {success
    //           ? (<p className="success">{success}</p>)
    //           : (error && (<p className="error">{error}</p>))
    //         }
    //         <a href=""
    //           onClick={(ev) => {
    //             ev.preventDefault();
    //             this.props.passwordForgot(this.state.email);
    //           }}
    //         >Wachtwoord vergeten?</a>
    //       </div>
    //   </mdl.Card>
    //   </form>
    // );
  }
}
