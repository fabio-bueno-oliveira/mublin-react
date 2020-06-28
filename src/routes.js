import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import LandingPage from './containers/LandingPage'
import LoginPage from './containers/LoginPage'
import HomePage from './containers/HomePage'

function Routes (props) {

    return(
        <HashRouter>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/home" component={HomePage} />
            </Switch>
        </HashRouter>
    );
};

export default Routes