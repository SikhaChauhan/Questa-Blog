// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "mern-blog-ae30c.firebaseapp.com",
//   projectId: "mern-blog-ae30c",
//   storageBucket: "mern-blog-ae30c.appspot.com",
//   messagingSenderId: "690196201451",
//   appId: "1:690196201451:web:82adfc80d09e0adf9263ae"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);








// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-ae30c.firebaseapp.com",
  projectId: "mern-blog-ae30c",
  storageBucket: "mern-blog-ae30c.appspot.com",
  messagingSenderId: "690196201451",
  appId: "1:690196201451:web:82adfc80d09e0adf9263ae"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
