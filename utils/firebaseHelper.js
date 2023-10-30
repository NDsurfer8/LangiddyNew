import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";

let firebaseApp = null;

export const getFirebase = () => {
  if (!firebaseApp) {
    const firebaseConfig = {
      apiKey: "AIzaSyAXqZkJQ_CJY0lQRrGVQyofu-6FN2u9W9I",
      authDomain: "langiddy-app.firebaseapp.com",
      projectId: "langiddy-app",
      storageBucket: "langiddy-app.appspot.com",
      messagingSenderId: "558269589188",
      appId: "1:558269589188:web:50c6586b2adf02890c8b91",
      measurementId: "G-R9L96H1N7N",
    };

    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig);

    // Initialize Firebase Auth with async storage persistence
    initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }

  return firebaseApp;
};
