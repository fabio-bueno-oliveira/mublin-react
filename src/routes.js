import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { history } from './utils/history';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StartIntroPage from './pages/StartPages/Intro';
import StartStep1Page from './pages/StartPages/Step1';
import StartStep2Page from './pages/StartPages/Step2';
import StartStep3Page from './pages/StartPages/Step3';
import StartStep4Page from './pages/StartPages/Step4';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import Settings from './pages/Settings';
import SettingsPreferences from './pages/Settings/Preferences';
import SettingsProfile from './pages/Settings/Profile';
import SettingsProfilePicture from './pages/Settings/Profile/picture';

function Routes () {

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    function PrivateRoute ({component: Component, authed, ...rest}) {
        return (
          <Route
            {...rest}
            render={(props) => authed === true
              ? <Component {...props} />
              : <Redirect to={{pathname: '/login', state: { errorMsg: "É necessário fazer o login" }}} />}
          />
        )
    }

    return(
        <BrowserRouter history={history}>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <PrivateRoute authed={loggedIn} path="/start/intro" component={StartIntroPage} />
                <PrivateRoute authed={loggedIn} path="/start/step1" component={StartStep1Page} />
                <PrivateRoute authed={loggedIn} path="/start/step2" component={StartStep2Page} />
                <PrivateRoute authed={loggedIn} path="/start/step3" component={StartStep3Page} />
                <PrivateRoute authed={loggedIn} path="/start/step4" component={StartStep4Page} />
                <PrivateRoute authed={loggedIn} path="/home" component={HomePage} />
                <PrivateRoute authed={loggedIn} path="/profile" component={ProfilePage} />
                <PrivateRoute authed={loggedIn} path="/project/:username" component={ProjectPage} />
                <PrivateRoute authed={loggedIn} path="/settings/profile/picture" component={SettingsProfilePicture} />
                <PrivateRoute authed={loggedIn} path="/settings/profile" component={SettingsProfile} />
                <PrivateRoute authed={loggedIn} path="/settings/preferences" component={SettingsPreferences} />
                <PrivateRoute authed={loggedIn} path="/settings/" component={Settings} />
                <PrivateRoute authed={loggedIn} path="/:username" component={ProfilePage} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;