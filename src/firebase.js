import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDb1PVAUu8upgb0zGgjySnvpw36qv4q_V4',
  authDomain: 'instagram-mern-practice-92421.firebaseapp.com',
  databaseURL: 'https://instagram-mern-practice-default-rtdb.firebaseio.com',
  projectId: 'instagram-mern-practice',
  storageBucket: 'instagram-mern-practice.appspot.com',
  messagingSenderId: '610885482772',
  appId: '1:610885482772:web:4e7a547084aa759296ea01',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
