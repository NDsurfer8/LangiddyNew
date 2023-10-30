import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import AuthInput from "./AuthInput";
import { Entypo } from "@expo/vector-icons";
import SubmitButtonLogin from "./SubmitButtonLogin";
import {
  validateEmail,
  validatePassword,
  validateString,
} from "../utils/validationConstraints";
import React, { useReducer, useEffect } from "react";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { useCallback, useState } from "react";
import {
  recentLogin,
  saveDataToStorageApple,
  signIn,
} from "../utils/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import Purchases from "react-native-purchases";
import colors from "../constants/colors";
import Icon from "../assets/images/langiddyIcon.png";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  OAuthProvider,
  signInWithCredential,
  getAuth,
  getIdToken,
} from "@firebase/auth";
import { authenticate } from "../store/authSlice";
import { getFirebase } from "../utils/firebaseHelper";
import { getDatabase, ref, set, child } from "firebase/database";
import getUserData from "../utils/actions/userActions";
import { storePushToken, userLogout } from "../utils/actions/authActions";

// allows us not to have to type to sign in
// remove before production
const isTestMode = false;

const initialState = {
  inputValues: {
    email: isTestMode ? "nad@test.com" : "",
    password: isTestMode ? "password" : "",
  },
  inputValidities: {
    email: isTestMode ? true : false,
    password: isTestMode ? true : false,
  },
  formIsValid: isTestMode ? true : false,
};

const SignInForm = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    try {
      setIsLoading(true);
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);

      await dispatch(action);

      console.log("userData", userData);
      const { customerInfo } = await Purchases.logIn(userData.userId);
      console.log("customerInfoSignIn", customerInfo);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const [isAppleSigninAvailable, setIsAppleSigninAvailable] = useState(false);

  const isAuth = useSelector((state) => !!state.auth.token);
  useEffect(() => {
    // checks if apple signin is available
    const loadAppleAuth = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setIsAppleSigninAvailable(isAvailable);
    };

    loadAppleAuth();
  }, []);

  const loginWithApple = async () => {
    const app = getFirebase();
    const auth = getAuth(app);
    try {
      setIsLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken } = credential;
      if (identityToken) {
        const provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
        const credential = provider.credential({
          idToken: identityToken,
        });

        const { user } = await signInWithCredential(auth, credential);
        console.log("user", user);
        //TODO: after
        const userDataa = await getUserData(user.uid);
        console.log("userDataa", userData);
        if (!userDataa) {
          await createUser(user.email, user.uid);
        }
        const { uid, stsTokenManager } = user;
        const { accessToken, expirationTime } = stsTokenManager;
        console.log("accessToken", accessToken);
        const expirationDate = new Date(expirationTime);
        const timeNow = new Date();
        const timeLeft = expirationDate - timeNow;

        const userData = await getUserData(uid);

        dispatch(authenticate({ token: accessToken, userData }));
        console.log("token", token);
        saveDataToStorageApple(accessToken, uid, expirationDate);
        await storePushToken(userData);
        //TODO: before
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.goback()}>
        <Entypo
          style={{
            justifyContent: "center",
            alignSelf: "center",
          }}
          name="chevron-small-up"
          size={24}
          color="black"
        />
        <Text
          style={{
            fontSize: 11,
            color: colors.defaultTextColor,
            fontFamily: "regular",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          Go back
        </Text>
      </TouchableOpacity>

      <Image
        source={Icon}
        style={{
          width: 60,
          height: 60,
          borderRadius: 50,
          marginTop: 80,
        }}
      />
      <View
        style={{
          marginTop: 40,
          marginBottom: 20,
        }}
      >
        <Text style={styles.labelText}>Welcome to Langiddy</Text>
        <Text style={styles.directionText}>
          Please enter your email and password.
        </Text>
      </View>
      <AuthInput
        id="email"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
        error={formState.inputValidities.email}
      />
      <AuthInput
        id="password"
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        onInputChanged={inputChangedHandler}
        error={formState.inputValidities.password}
      />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.orange}
          style={{
            marginTop: 20,
          }}
        />
      ) : (
        <SubmitButtonLogin
          title="Login"
          disabled={!formState.formIsValid}
          onPress={authHandler}
        />
      )}

      <TouchableOpacity onPress={() => props.passwordReset()}>
        <Text
          style={{
            fontSize: 17,
            marginTop: "65%",
            // marginTop: 260,
            color: colors.orange,
            opacity: 0.8,
            fontFamily: "bold",
            justifyContent: "flex-end",
            alignSelf: "flex-end",
            fontWeight: "bold", // Add this line
            position: Platform.OS === "ios" ? "absolute" : "relative",
          }}
        >
          Forgot password
        </Text>
      </TouchableOpacity>
      {isAppleSigninAvailable && (
        <Text
          style={{
            fontSize: 15,
            paddingTop: 25,
            color: colors.defaultTextColor,
            fontFamily: "bold",
            justifyContent: "center",
            alignSelf: "center",
            fontWeight: "bold", // Add this line
          }}
        >
          Or
        </Text>
      )}

      {isAppleSigninAvailable && !isAuth && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={
            AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
          }
          cornerRadius={5}
          style={{
            marginTop: 20,
            width: "100%",
            height: 42,
            justifyContent: "center",
            borderRadius: 15,
            alignSelf: "center",
          }}
          onPress={loginWithApple}
        />
      )}
      <TouchableOpacity onPress={() => props.register()}>
        <Text
          style={{
            fontSize: 15,
            paddingTop: 25,
            color: "black",
            fontFamily: "regular",
            justifyContent: "center",
            alignSelf: "center",
            fontWeight: "bold", // Add this line
          }}
        >
          Don't have an account?{" "}
          <Text style={{ fontFamily: "bold", color: "black" }}>Sign up.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelText: {
    fontSize: 30,
    color: colors.defaultTextColor,
    fontFamily: "semiBold",
  },
  directionText: {
    fontSize: 14,
    paddingTop: 15,
    color: colors.defaultTextColor,
  },
});
