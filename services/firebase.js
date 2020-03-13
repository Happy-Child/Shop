import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyAxAlyN4KrTy1HAKWdUsQha7BeZkQZam7E",
  authDomain: "lazuka-shop.firebaseapp.com",
  databaseURL: "https://lazuka-shop.firebaseio.com",
  projectId: "lazuka-shop",
  storageBucket: "lazuka-shop.appspot.com",
  messagingSenderId: "314428464619",
  appId: "1:314428464619:web:3a822bdfa801aec2d34dae"
};

!firebase.apps.length ? firebase.initializeApp(config) : '';

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
