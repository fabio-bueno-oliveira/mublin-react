// import firebase from 'firebase/app';
// import 'firebase/storage';

// const config ={
//     apiKey: "AIzaSyB-Ac2_IAB8TtYrb8SJb_Lh3cEMSDzaX60",
//     authDomain: "mublin-fd83c.firebaseapp.com",
//     databaseURL: "https://mublin-fd83c.firebaseio.com",
//     projectId: "mublin-fd83c",
//     storageBucket: "mublin-fd83c.appspot.com",
//     messagingSenderId: "372123473623",
//     appId: "1:372123473623:web:4ab0701369bbb1a0108292"
// }

// firebase.initializeApp(config)

// const storage = firebase.storage()

// export { storage, firebase as default }
  
import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB-Ac2_IAB8TtYrb8SJb_Lh3cEMSDzaX60",
    authDomain: "mublin-fd83c.firebaseapp.com",
    databaseURL: "https://mublin-fd83c.firebaseio.com",
    projectId: "mublin-fd83c",
    storageBucket: "mublin-fd83c.appspot.com",
    messagingSenderId: "372123473623",
    appId: "1:372123473623:web:4ab0701369bbb1a0108292"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };