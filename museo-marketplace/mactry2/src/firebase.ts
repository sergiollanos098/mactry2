import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCEBsLOVkHdvH9HcCaHa9O2On0u0FlRCt0",
  authDomain: "macdemo2.firebaseapp.com",
  databaseURL: "https://macdemo2-default-rtdb.firebaseio.com",
  projectId: "macdemo2",
  storageBucket: "macdemo2.firebasestorage.app",
  messagingSenderId: "631909084079",
  appId: "1:631909084079:web:0373acd3feb8bd8f9edd5a"
};

export const app = initializeApp(firebaseConfig);