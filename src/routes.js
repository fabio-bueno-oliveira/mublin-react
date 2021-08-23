import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { history } from './utils/history';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/LoginPage/Forgot';
import RedefinePasswordPage from './pages/LoginPage/Forgot/redefine';
import StartIntroPage from './pages/StartPages/Intro';
import StartStep1Page from './pages/StartPages/Step1';
import StartStep2Page from './pages/StartPages/Step2';
import StartStep3Page from './pages/StartPages/Step3';
import StartStep4Page from './pages/StartPages/Step4';
import Home from './pages/Home';
import Career from './pages/Career/timeline';
import CareerMyGoals from './pages/Career/myGoals';
import Feed from './pages/Feed';
import ProfilePage from './pages/ProfilePage';
import ProfileGearPage from './pages/ProfilePage/gear';
import PublicProfilePage from './pages/ProfilePage/publicPage';
import New from './pages/New';
import NewProject from './pages/New/project';
import NewProjectIdea from './pages/New/idea';
import NewEvent from './pages/New/event';
import NewEventStep2 from './pages/New/event-step2'
import JoinProject from './pages/New/join';
import ProjectPage from './pages/ProjectPage';
import ProjectBackstagePage from './pages/Backstage/Project';
import ProjectBackstagePreferencesPage from './pages/Backstage/manageParticipation';
import BackstagesMainPage from './pages/Backstage';
import ProjectsManagementPage from './pages/MyProjects/list';
import ProjectManagementPage from './pages/MyProjects/project';
import NotificationsPage from './pages/NotificationsPage';
import SearchPage from './pages/SearchPage';
import Messages from './pages/Messages';
import Conversation from './pages/Messages/conversation'
import Settings from './pages/Settings';
import MySubscription from './pages/Settings/Subscription';
import SettingsPreferences from './pages/Settings/Preferences';
import SettingsProfile from './pages/Settings/Profile';
import SettingsProfilePicture from './pages/Settings/Profile/picture';
import ProductPage from './pages/Gear/productPage'
import SubmitNewProduct from './pages/Gear/submitNewProduct'
import MyGearPage from './pages/Gear/myGear'
import AdminPage from './pages/Admin'

function Routes (props) {

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

    function PublicVersion ({component: Component, authed, path, ...rest}) {
        return (
          <Route
            {...rest}
            render={(props) => authed === true
              ? <Component {...props} />
              : <Redirect to={{pathname: '/'+props.match.params.username+'/public' }} />}
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
                <Route path="/forgot-password" component={ForgotPasswordPage} />
                <Route path="/redefine-password" component={RedefinePasswordPage} />
                <PrivateRoute authed={loggedIn} path="/start/intro" component={StartIntroPage} />
                <PrivateRoute authed={loggedIn} path="/start/step1" component={StartStep1Page} />
                <PrivateRoute authed={loggedIn} path="/start/step2" component={StartStep2Page} />
                <PrivateRoute authed={loggedIn} path="/start/step3" component={StartStep3Page} />
                <PrivateRoute authed={loggedIn} path="/start/step4" component={StartStep4Page} />
                <PrivateRoute authed={loggedIn} path="/home" component={Home} />
                <PrivateRoute authed={loggedIn} path="/career/my-goals" component={CareerMyGoals} />
                <PrivateRoute authed={loggedIn} path="/career/my-gear" component={MyGearPage} />
                <PrivateRoute authed={loggedIn} path="/career" component={Career} />
                <PrivateRoute authed={loggedIn} path="/feed" component={Feed} />
                <PrivateRoute authed={loggedIn} path="/new/event" component={NewEvent} />
                <PrivateRoute authed={loggedIn} path="/new/event/step2/" component={NewEventStep2} />
                <PrivateRoute authed={loggedIn} path="/new/project" component={NewProject} />
                <PrivateRoute authed={loggedIn} path="/new/idea" component={NewProjectIdea} />
                <PrivateRoute authed={loggedIn} path="/new/join" component={JoinProject} />
                <PrivateRoute authed={loggedIn} path="/new" component={New} />
                <PrivateRoute authed={loggedIn} path="/backstage/preferences/:projectUsername" component={ProjectBackstagePreferencesPage} />
                <PrivateRoute authed={loggedIn} path="/backstage/:username" component={ProjectBackstagePage} />
                <PrivateRoute authed={loggedIn} path="/backstages" component={BackstagesMainPage} />
                <PrivateRoute authed={loggedIn} path="/project/:username" component={ProjectPage} />
                <PrivateRoute authed={loggedIn} path="/my-projects/:username" component={ProjectManagementPage} />
                <PrivateRoute authed={loggedIn} path="/my-projects" component={ProjectsManagementPage} />
                <PrivateRoute authed={loggedIn} path="/notifications" component={NotificationsPage} />
                <PrivateRoute authed={loggedIn} path="/search" component={SearchPage} />
                <PrivateRoute authed={loggedIn} path="/messages/conversation/:profileId" component={Conversation} />
                <PrivateRoute authed={loggedIn} path="/messages" component={Messages} />
                <PrivateRoute authed={loggedIn} path="/settings/profile/picture" component={SettingsProfilePicture} />
                <PrivateRoute authed={loggedIn} path="/settings/profile" component={SettingsProfile} />
                <PrivateRoute authed={loggedIn} path="/settings/preferences" component={SettingsPreferences} />
                <PrivateRoute authed={loggedIn} path="/settings/subscription" component={MySubscription} />
                <PrivateRoute authed={loggedIn} path="/settings" component={Settings} />
                <PrivateRoute authed={loggedIn} path="/gear/product/:productId" component={ProductPage} />
                <PrivateRoute authed={loggedIn} path="/gear/submit/product" component={SubmitNewProduct} />
                <PrivateRoute authed={loggedIn} path="/gear" component={MyGearPage} />
                <PrivateRoute authed={loggedIn} path="/admin" component={AdminPage} />
                <Route exact path="/:username/public" component={PublicProfilePage} />
                <Route exact path="/:username/gear" component={ProfileGearPage} />
                <PublicVersion authed={loggedIn} path="/:username" component={ProfilePage} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;