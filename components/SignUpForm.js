import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AuthInput from "./AuthInput";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import SubmitButtonLogin from "./SubmitButtonLogin";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import {
  appleSignIn,
  saveDataToStorageApple,
  signUp,
  storePushToken,
  userLogout,
} from "../utils/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
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
import jwt_decode from "jwt-decode";
import { getFirebase } from "../utils/firebaseHelper";
import { getDatabase, ref, set, child } from "firebase/database";
import getUserData from "../utils/actions/userActions";
import { logout } from "../store/authSlice";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },

  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = (props) => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

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

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);
  // ? Auth handler email and password
  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);

      const action = signUp(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);
      await dispatch(action);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  // TODO: Apple Signin

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
        //TODO: after
        console.log("user", user);
        const userDataa = await getUserData(user.uid);
        console.log("userDataa", userData);
        if (!userDataa) {
          await createUser(user.email, user.uid);
        }
        const { uid, stsTokenManager } = user;
        const { accessToken, expirationTime } = stsTokenManager;
        const expirationDate = new Date(expirationTime);
        const timeNow = new Date();
        const timeLeft = expirationDate - timeNow;

        const userData = await getUserData(uid);

        dispatch(authenticate({ token: accessToken, userData }));
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
          Please register for an account below.
        </Text>
      </View>

      <AuthInput
        id="email"
        placeholder="Email"
        onInputChanged={inputChangedHandler}
        autoCapitalize="none"
        keyboardType="email-address"
        error={formState.inputValidities.email}
      />
      <AuthInput
        id="password"
        placeholder="Password"
        onInputChanged={inputChangedHandler}
        autoCapitalize="none"
        secureTextEntry={true}
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
          title="Sign up"
          disabled={!formState.formIsValid}
          onPress={authHandler}
        />
      )}
      {isAppleSigninAvailable && (
        <Text
          style={{
            fontSize: 15,
            paddingTop: 25,
            color: "black",
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
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
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
      <TouchableOpacity onPress={() => props.login()}>
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
          Already have an account?{" "}
          <Text style={{ fontFamily: "bold", color: "black" }}>Login.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpForm;
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
//TODO: working rules below
