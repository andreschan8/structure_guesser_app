const firebaseConfig = {
    apiKey: "AIzaSyAuCMK3DsjYAbsycXam3PzcWSJdL33dTW4",
    authDomain: "guessstructure.firebaseapp.com",
    projectId: "guessstructure",
    storageBucket: "guessstructure.appspot.com",
    messagingSenderId: "1087487664626",
    appId: "1:1087487664626:web:049799ace8fc2f86880b6b",
    measurementId: "G-VMHN2FHF61"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true, merge: true });
