import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setDidTryAutoLogin, authenticate } from "../../store/authSlice";
import getUserData from "../../utils/actions/userActions";
import { getAuth } from "firebase/auth";
import { getFirebase } from "../../utils/firebaseHelper";
import { getDatabase, ref, update } from "firebase/database";

const startUpScreen = () => {
  const dispatch = useDispatch();
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  useEffect(() => {
    const tryLogin = async () => {
      // retrieve data from async storage
      const storedAuthInfo = await AsyncStorage.getItem("userData");

      // check if data is null

      if (!storedAuthInfo) {
        // dispatch action to set didTryAutoLogin to true
        dispatch(setDidTryAutoLogin());
        return;
      }

      // parse data
      const parsedData = JSON.parse(storedAuthInfo);
      // destructure data
      const {
        token,
        userId,
        expirationDate: expirationDateString,
      } = parsedData;

      const expirationDate = new Date(expirationDateString);
      // check if token is expired

      const userData = await getUserData(userId);
      // dispatch action to set didTryAutoLogin to true
      dispatch(authenticate({ token, userData }));
    };

    tryLogin();
  }, [dispatch, didTryAutoLogin]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.orange} />
    </View>
  );
};

export default startUpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
