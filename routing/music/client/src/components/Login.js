/* eslint-disable no-constant-condition */
import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import { client } from '../Client';

class Login extends Component {
  state = {
    loginInProgress: false,
    shouldRedirect: false
  }

  performLogin = async () => {
    this.setState({ loginInProgress: true });
    try {
      await client.login();
      this.setState({ shouldRedirect: true });
    } catch (err) {
      console.error(err);
    }
  }

  redirectPath = () => {
    const locationState = this.props.location.state;
    const pathname = (locationState && locationState.from);

    return pathname || '/albums';
  }

  render() {
    if (this.state.shouldRedirect) {
      return (
        <Redirect to={this.redirectPath()} />
      );
    } else {
      return (
        <div className='ui one column centered grid'>
          <div className='ten wide column'>
            <div
              className='ui raised very padded text container segment'
              style={{ textAlign: 'center' }}
            >
              <h2 className='ui green header'>
                Fullstack Music
              </h2>
              {
                !!this.state.loginInProgress && (
                  <div className="ui active centered inline loader"></div>
                )
              }

              {
                !this.state.loginInProgress && (
                  <div className="ui large green submit button"
                    onClick={this.performLogin}>
                    Login
                  </div>
                )
              }
            </div>
          </div>
        </div>
      );
    }
  }
}


export default Login;
