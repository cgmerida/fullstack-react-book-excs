/* eslint-disable no-shadow */
import React, { createElement } from 'react';

import { Route, Redirect } from 'react-router-dom';

import { client } from '../Client';

const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={(props) => (
    client.isLoggedIn() ? (
      createElement(component, props)
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location.pathname },
      }} />
    )
  )} />
);

export default PrivateRoute;
