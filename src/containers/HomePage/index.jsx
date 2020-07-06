import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';
import './styles.scss'

function HomePage (props) {

    const user = useSelector(state => state.authentication.user);

    const dispatch = useDispatch();

    let history = useHistory();

    const logout = () => {
        sessionStorage.removeItem('JWT');
        history.push("/login");
    }

    const AuthStr = 'Bearer '.concat(sessionStorage.getItem('JWT')); 
    axios.get('https://mublin.herokuapp.com/userinfo', { 
        headers: { Authorization: AuthStr },
    })
     .then(response => {
         // If request is good...
         console.log(response.data);
      })
     .catch((error) => {
         console.log('error ' + error);
      });

    return (
        <>
        <main className="home">
            <div className="ui container">
                <nav>
                    <button onClick={logout}>Logout</button>
                </nav>
                <header>
                    <h1>HOME</h1>
                </header>
            </div>
        </main>
        </>
    );
};

export default withRouter(HomePage);