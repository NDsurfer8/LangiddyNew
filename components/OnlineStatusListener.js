import React, { useEffect } from "react";
import { getDatabase, ref, update, onDisconnect, set } from "firebase/database";
import { getFirebase } from "../utils/firebaseHelper";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";

const OnlineStatusListener = () => {
  const userData = useSelector((state) => state.auth.userData);
  const userToken = useSelector((state) => state.auth.token);
  console.log("userToken", userToken);
  const app = getFirebase();
  const db = getDatabase(app);
  const auth = getAuth();
  const user = auth.currentUser;
  console.log("user", user);

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const userStatusRef = ref(db, `users/${user.uid}/onlineStatus`);
      const presenceRef = ref(db, ".info/connected");

      set(userStatusRef, "Online");

      onDisconnect(userStatusRef).set("Away");

      return () => {
        set(userStatusRef, "Away");
      };
    }
  }, [db, user, userToken]);

  return null;
};

export default OnlineStatusListener;
