import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from './store';
import App from './App';
import {IKContext} from "imagekitio-react"
import './styles/global.scss'
import './styles/bootstrap-spacing.scss'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <IKContext
        publicKey="public_vFOVSJ4ZRbnv5fT4XZFbo82R2DE="
        urlEndpoint="https://ik.imagekit.io/mublin"
        transformationPosition="path"
        authenticationEndpoint="https://mublin.herokuapp.com/imagekit"
      >
        <App />
      </IKContext>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
