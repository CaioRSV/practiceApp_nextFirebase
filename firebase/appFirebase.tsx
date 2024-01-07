import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';

const firebaseConfigs = {
    apiKey: "AIzaSyDXXNPGPLxC5wcW2PDSthqwx1Z4pQE625E",
    authDomain: "crsv-kanbanproject-mp.firebaseapp.com",
    databaseURL: "https://crsv-kanbanproject-mp-default-rtdb.firebaseio.com",
    projectId: "crsv-kanbanproject-mp",
    storageBucket: "crsv-kanbanproject-mp.appspot.com",
    messagingSenderId: "467426220148",
    appId: "1:467426220148:web:67ed9b009637b9c5ab9921"
  };

const app = initializeApp(firebaseConfigs);

export default app;