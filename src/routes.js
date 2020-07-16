import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { history } from './utils/history';
import { useSelector } from 'react-redux';
import LandingPage from './containers/LandingPage';
import LoginPage from './containers/LoginPage';
import HomePage from './containers/HomePage';
import ProfilePage from './containers/ProfilePage';
import ProjectPage from './containers/ProjectPage';

function Routes () {

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    function PrivateRoute ({component: Component, authed, ...rest}) {
        return (
          <Route
            {...rest}
            render={(props) => authed === true
              ? <Component {...props} />
              : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
          />
        )
    }

    return(
        <BrowserRouter history={history}>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <PrivateRoute authed={loggedIn} path="/home" component={HomePage} />
                <PrivateRoute authed={loggedIn} path="/profile" component={ProfilePage} />
                <PrivateRoute authed={loggedIn} path="/project" component={ProjectPage} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;