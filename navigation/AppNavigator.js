import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AuthScreen from "../src/screens/AuthScreen";
import MainNavigator from "./MainNavigator";
import { useSelector, useDispatch } from "react-redux";
import StartUpScreen from "../src/screens/StartUpScreen";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { getDatabase, onDisconnect, ref, update } from "firebase/database";
import * as AppleAuthentication from "expo-apple-authentication";
import { getFirebase } from "../utils/firebaseHelper";
import { onValue } from "firebase/database";
import { authenticate, setDidTryAutoLogin } from "../store/authSlice";
import getUserData from "../utils/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  saveDataToStorageApple,
  storePushToken,
} from "../utils/actions/authActions";
import OnlineStatusListener from "../components/OnlineStatusListener";

// import * as InAppPurchases from "expo-in-app-purchases";

function AppNavigator() {
  const dispatch = useDispatch();

  // allows us to access the state and shows that the user is logged in
  const isAuth = useSelector((state) => !!state.auth.token);
  const userToken = useSelector((state) => state.auth);
  // console.log("userToken", userToken);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  useEffect(() => {
    // Set up the onIdTokenChanged listener
    const app = getFirebase();
    const db = getDatabase(app);
    const auth = getAuth(app);
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      // check also to see if token is expired
      console.log("unsubscribe", unsubscribe);

      if (user) {
        try {
          const newToken = await user.getIdToken(true);

          const userData = await getUserData(user.uid);
          // Dispatch the action to update the state with the new token
          dispatch(authenticate({ token: newToken, userData }));
          saveDataToStorageApple(newToken, user.uid, new Date());
          //TODO: Maybe remove line below if push token issue persists
          if (userData) {
            await storePushToken(userData);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          // Handle the error here (e.g., show an error message, log, etc.)
        }
      } else {
        // No user is signed in, dispatch an action to set didTryAutoLogin to true
        dispatch(setDidTryAutoLogin());
      }
    });

    return () => {
      // Unsubscribe from the onIdTokenChanged listener when the component unmounts
      unsubscribe();
    };
  }, [dispatch, didTryAutoLogin]);

  useEffect(() => {
    // If the user was authenticated before, immediately update the status to online
    if (isAuth) {
      const app = getFirebase();
      const db = getDatabase(app);
      const user = getAuth(app).currentUser;

      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        update(userRef, {
          isOnline: true,
        });
      }
    }
  }, [isAuth, userToken]);

  // listen to changes for users token changes

  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
}

export default AppNavigator;
