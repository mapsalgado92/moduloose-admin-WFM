import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyDmZSo7o8WB-bsge5T_Rd9VJdODhA-wD2Y",
    authDomain: "my-firebase-1f789.firebaseapp.com",
    projectId: "my-firebase-1f789",
    messagingSenderId: "917517905132",
    appId: "1:917517905132:web:2cc22f398c1a2511a209c9",
    measurementId: "G-7N4N4SG1FZ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const myFirestore = firebase.firestore();

  export { myFirestore };