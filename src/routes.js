import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { history } from './utils/history';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StartIntroPage from './pages/StartPages/Intro';
import StartStep1Page from './pages/StartPages/Step1';
import StartStep2Page from './pages/StartPages/Step2';
import StartStep3Page from './pages/StartPages/Step3';
import StartStep4Page from './pages/StartPages/Step4';
import Home from './pages/Home';
import Feed from './pages/Feed';
import New from './pages/New';
import ProfilePage from './pages/ProfilePage';
import NewProject from './pages/New/project';
import NewProjectIdea from './pages/New/idea';
import JoinProject from './pages/New/join';
import ProjectPage from './pages/ProjectPage';
import ProjectBackstagePage from './pages/Backstage/Project';
import BackstageMainPage from './pages/Backstage';
import NotificationsPage from './pages/NotificationsPage';
import SearchPage from './pages/SearchPage';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import MySubscription from './pages/Settings/Subscription';
import SettingsPreferences from './pages/Settings/Preferences';
import SettingsProfile from './pages/Settings/Profile';
import SettingsProfilePicture from './pages/Settings/Profile/picture';
import AdminPage from './pages/Admin'

function Routes () {

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    function PrivateRoute ({component: Component, authed, ...rest}) {
        return (
          <Route
            {...rest}
            render={(props) => authed === true
              ? <Component {...props} />
              : <Redirect to={{pathname: '/', state: { errorMsg: "É necessário fazer o login" }}} />}
          />
        )
    }

    return(
        <BrowserRouter history={history}>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/about" exact component={About} />
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <PrivateRoute authed={loggedIn} path="/start/intro" component={StartIntroPage} />
                <PrivateRoute authed={loggedIn} path="/start/step1" component={StartStep1Page} />
                <PrivateRoute authed={loggedIn} path="/start/step2" component={StartStep2Page} />
                <PrivateRoute authed={loggedIn} path="/start/step3" component={StartStep3Page} />
                <PrivateRoute authed={loggedIn} path="/start/step4" component={StartStep4Page} />
                <PrivateRoute authed={loggedIn} path="/home" component={Home} />
                <PrivateRoute authed={loggedIn} path="/feed" component={Feed} />
                <PrivateRoute authed={loggedIn} path="/new/project" component={NewProject} />
                <PrivateRoute authed={loggedIn} path="/new/idea" component={NewProjectIdea} />
                <PrivateRoute authed={loggedIn} path="/new/join" component={JoinProject} />
                <PrivateRoute authed={loggedIn} path="/new" component={New} />
                <PrivateRoute authed={loggedIn} path="/backstage/:username" component={ProjectBackstagePage} />
                <PrivateRoute authed={loggedIn} path="/backstage" component={BackstageMainPage} />
                <PrivateRoute authed={loggedIn} path="/project/:username" component={ProjectPage} />
                <PrivateRoute authed={loggedIn} path="/notifications" component={NotificationsPage} />
                <PrivateRoute authed={loggedIn} path="/search" component={SearchPage} />
                <PrivateRoute authed={loggedIn} path="/messages" component={Messages} />
                <PrivateRoute authed={loggedIn} path="/settings/profile/picture" component={SettingsProfilePicture} />
                <PrivateRoute authed={loggedIn} path="/settings/profile" component={SettingsProfile} />
                <PrivateRoute authed={loggedIn} path="/settings/preferences" component={SettingsPreferences} />
                <PrivateRoute authed={loggedIn} path="/settings/subscription" component={MySubscription} />
                <PrivateRoute authed={loggedIn} path="/settings" component={Settings} />
                <PrivateRoute authed={loggedIn} path="/admin" component={AdminPage} />
                <PrivateRoute authed={loggedIn} path="/:username" component={ProfilePage} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;