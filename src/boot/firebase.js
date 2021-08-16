import firebase from 'firebase/app';

require('firebase/auth')
require('firebase/firestore')
require('firebase/storage')
require('firebase/functions')


var firebaseConfig = {
    apiKey: "AIzaSyDaLSk7D_B-skFs4xtEoHcJVajukJTaklo",
    authDomain: "okkotrivia.firebaseapp.com",
    projectId: "okkotrivia",
    storageBucket: "okkotrivia.appspot.com",
    messagingSenderId: "329124106596",
    appId: "1:329124106596:web:ee37b13406db3d55752a71",
    measurementId: "G-LER08XX72W"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const functions = firebase.functions()

export {
	firebase,
	auth,
	db,
	storage,
	functions
}
