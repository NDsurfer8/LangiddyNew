import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { getFirebase } from "../firebaseHelper";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  OAuthProvider,
  signInWithCredential,
  getIdToken,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  child,
  update,
  remove,
  get,
} from "firebase/database";

import { authenticate } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getUserData from "./userActions";
import { logout } from "../../store/authSlice";
import Purchases from "react-native-purchases";
import * as AppleAuthentication from "expo-apple-authentication";

let timer; // timer to logout user

export const signUp = (email, password) => {
  return async (dispatch) => {
    const app = getFirebase();
    const auth = getAuth(app);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expirationDate = new Date(expirationTime);
      const timeNow = new Date();
      const timeLeft = expirationDate - timeNow;

      const userData = await createUser(email, uid);

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expirationDate);
      await storePushToken(userData);
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      let message = "Something went wrong!";

      if (errorCode === "auth/email-already-in-use") {
        message = "The email is already in use.";
      }
      throw new Error(message);
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebase();
    const auth = getAuth(app);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expirationDate = new Date(expirationTime);
      const timeNow = new Date();
      const timeLeft = expirationDate - timeNow; // Set timer to 1 minute before token expiration

      const userData = await getUserData(uid);

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expirationDate);
      await storePushToken(userData);
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      let message = "Something went wrong!";

      if (
        errorCode === "auth/wrongPassword" ||
        errorCode === "auth/user-not-found"
      ) {
        message = "Username or password incorrect.";
      }
      throw new Error(message);
    }
  };
};

// forgot password so we need to send an email to the user
export const getPasswordResetEmail = async (email) => {
  const app = getFirebase();
  const auth = getAuth(app);
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
    const errorCode = error.code;
    let message = "Something went wrong!";
    if (errorCode === "auth/user-not-found") {
      message = "User not found.";
    }
    throw new Error(message);
  }
};

const generateRandomUsername = () => {
  // List of adjectives and nouns for username generation
  const adjectives = [
    "happy",
    "funny",
    "clever",
    "smart",
    "silly",
    "cool",
    "awesome",
    "bright",
    "swift",
    "kind",
    "brave",
    "alive",
    "fiery",
    "alert",
    "vivid",
    "fresh",
    "jolly",
    "fancy",
    "grand",
    "tasty",
    "zesty",
    "dandy",
    "merry",
    "quick",
    "neat",
    "witty",
    "shiny",
    "zippy",
    "snazzy",
  ];

  const nouns = [
    "panda",
    "tiger",
    "bird",
    "koala",
    "dolphin",
    "lion",
    "eagle",
    "duck",
    "swan",
    "daisy",
    "falcon",
    "gazelle",
    "bee",
    "lark",
    "gecko",
    "horse",
    "lemur",
    "meerkat",
    "otter",
    "bunny",
    "puppy",
    "raccoon",
    "seal",
    "toucan",
    "viper",
    "whale",
    "yak",
  ];

  // Choose a random adjective and noun from the lists
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  // Generate a random number between 100 and 999
  const randomNumber = Math.floor(Math.random() * 900) + 100;

  // Combine the adjective, noun, and number to form the username
  const username = `${randomAdjective}-${randomNoun}-${randomNumber}`;

  return username;
};

const createUser = async (email, userId) => {
  // allows to search for a document in a collection with space in between
  // const firstLast = `${firstName} ${lastName}`.toLowerCase();
  //user is feeling giddy as soon as they create an account
  const username = generateRandomUsername();
  const firstLast = username;

  const userData = {
    firstLast,
    username,
    email,
    userId,
    signUpDate: new Date().toISOString(),
    hidden: false,
  };
  // reference to the database
  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expirationDate: expirationDate.toISOString(),
    })
  );
};

export const saveDataToStorageApple = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expirationDate: expirationDate.toISOString(),
    })
  );
};

export const userLogout = (userData) => {
  return async (dispatch) => {
    await removePushToken(userData);
    const app = getFirebase();
    const auth = getAuth(getFirebase(app));
    await auth.signOut();

    await AsyncStorage.removeItem("userData", () => {}).then(() => {
      AsyncStorage.clear(() => {});
      clearTimeout(timer);
      dispatch(logout());
    });
  };
};

export const recentLogin = async (userId) => {
  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);

  await update(childRef, { lastLogin: true });
  // setTimeout(async () => {
  //   await update(childRef, { lastLogin: false });
  // }, 5000);
};

export const updateSignedInUserData = async (userId, newData) => {
  if (newData.firstName && newData.lastName) {
    const firstLast = `${newData.firstName} ${newData.lastName}`.toLowerCase();
    newData.firstLast = firstLast;
  }
  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await update(childRef, newData);
};

export const deleteSignedInUserData = async (userId) => {
  try {
    const dbRef = ref(getDatabase());
    const childRef = child(dbRef, `users/${userId}`);
    console.log(childRef);
    await remove(childRef);

    const auth = getAuth(getFirebase());
    console.log("authCurrentUser", auth.currentUser);

    await auth.currentUser.delete();

    await AsyncStorage.removeItem("userData");
    await AsyncStorage.clear();

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const storePushToken = async (userData) => {
  if (!Device.isDevice) {
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const tokenData = { ...userData.pushTokens } || {};
  const tokenArray = Object.values(tokenData);
  if (tokenArray.includes(token)) {
    return;
  }
  tokenArray.push(token);
  for (let i = 0; i < tokenArray.length; i++) {
    const tok = tokenArray[i];
    tokenData[i] = tok;
  }

  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userData.userId}/pushTokens`);
  await set(userRef, tokenData);
};

export const removePushToken = async (userData) => {
  if (!Device.isDevice) {
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const tokenData = await getUserPushTokens(userData.userId);

  for (const key in tokenData) {
    if (tokenData[key] === token) {
      delete tokenData[key];
      break;
    }
  }

  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userData.userId}/pushTokens`);
  await set(userRef, tokenData);
};

export const getUserPushTokens = async (userId) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}/pushTokens`);
    const snapshot = await get(userRef);
    if (!snapshot.exists() || !snapshot) {
      return {};
    }
    return snapshot.val() || {};
  } catch (error) {
    console.log(error);
  }
};
