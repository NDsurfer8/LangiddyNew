import {
  ref,
  getDatabase,
  child,
  get,
  val,
  query,
  orderByChild,
  startAt,
  endAt,
  remove,
  update,
  push,
  limitToLast,
  limitToFirst,
} from "firebase/database";
import { getFirebase } from "../firebaseHelper";

const getUserData = async (userId) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users/${userId}`);
    const snapshot = await get(childRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
};
export default getUserData;

export const getUsers = async () => {
  console.log("getUsers");
  try {
    console.log("childRef");
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users`);

    const snapshot = await get(childRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUserChats = async (userId) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));

    const childRef = child(dbRef, `userChats/${userId}`);
    const snapshot = await get(childRef);

    return snapshot.val();
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserChat = async (userId, key) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));

    const chatRef = child(dbRef, `userChats/${userId}/${key}`);
    await remove(chatRef);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addUserChat = async (userId, chatId) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `userChats/${userId}`);
    await push(chatRef, chatId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchUsers = async (queryText) => {
  const searchTerm = queryText.toLowerCase();
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users`);
    const queryRef = query(
      childRef,
      orderByChild("firstLast"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff")
    );
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error(error);
  }
};

export const searchUsersLanguage = async (language, languageFrom) => {
  // LOAD ONLY 100 USERS AT A TIME
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users`);
    // always grab different users from database
    const queryRef = query(
      childRef,
      orderByChild("language" && "languageFrom"),
      startAt(language && languageFrom),
      endAt(language && languageFrom)
      // limitToFirst(50)
    );
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error(error);
  }
};

export const searchUsersLanguageNative = async (languageFrom, languageTwo) => {
  // LOAD ONLY 100 USERS AT A TIME
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users`);
    // always grab different users from database
    const queryRef = query(
      childRef,
      orderByChild("languageFrom", "languageTwo"),
      startAt(languageFrom && languageTwo),
      endAt(languageFrom && languageTwo + "\uf8ff")
      // limitToFirst(50)
    );
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error(error);
  }
};

//! set subscription is active or inactive in database

export const setSubscription = async (userId, subscription) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users/${userId}`);
    await update(childRef, { subscription });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// add a rewaqrd to the user
export const addReward = async (userId, reward) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users/${userId}/rewardPoints`);
    await push(childRef, reward);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRewardPoint = async (userId) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users/${userId}/rewardPoints`);
    const snapshot = await get(childRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val()); // Return an array of reward points objects
    }
    return [];
  } catch (error) {
    console.error(error);
  }
};
