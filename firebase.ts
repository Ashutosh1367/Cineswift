import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCje4g5alVdkEmIG8KqD7-U6ufZfue-Wo8",
  authDomain: "cineswift-c9f70.firebaseapp.com",
  projectId: "cineswift-c9f70",
  storageBucket: "cineswift-c9f70.firebasestorage.app",
  messagingSenderId: "506425851533",
  appId: "1:506425851533:web:be137f81e95bf79b1aecc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
