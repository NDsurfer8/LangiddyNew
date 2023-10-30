import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Linking,
} from "react-native";
import CachedImage from "react-native-expo-cached-image";

import React, { useCallback } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";
import moment from "moment";
import colors from "../../constants/colors";
import { useReducer } from "react";
import { reducer } from "../../utils/reducers/formReducer";
import InputAbout from "../../components/InputAbout";
import { validateInput } from "../../utils/actions/formActions";
import SubmitButton from "../../components/SubmitButton";
import { updateLoggedInUserData } from "../../store/authSlice";
import { updateSignedInUserData } from "../../utils/actions/authActions";
import { hasFlag } from "country-flag-icons";

const ProfileScreen = ({ navigation, route }) => {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const history = useSelector((state) => state.history.history);
  console.log(
    "history",
    history.phrases.map((phrase) => phrase.updatedAt)
  );

  const mastered = history.phrases.filter(
    (phrase) => phrase.mastered && phrase.to === userData.language
  );
  const updatedAt = history.phrases.map((phrase) => phrase.updatedAt);

  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const status = userData.status || "";

  const initialState = {
    inputValues: {
      status,
    },
    inputValidities: {
      status: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.status != status;
  };

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [formState.inputValues, dispatch]);

  return (
    <SafeAreaView style={styles.container} showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.homeContainer}>
            <PageTitle title="Home" />
          </View>

          <View style={styles.containerDivider}>
            <View style={styles.imageContainer}>
              <View style={styles.infoContainer}>
                {userData.firstName.length <= 8 &&
                userData.lastName.length < 8 ? (
                  <Text adjustsFontSizeToFit style={styles.fullNameText}>
                    {userData.firstName} {userData.lastName}
                  </Text>
                ) : (
                  <Text adjustsFontSizeToFit style={styles.fullNameText}>
                    {userData.firstName}
                  </Text>
                )}

                <View style={styles.relationshipContainer}>
                  <MaterialCommunityIcons
                    name="briefcase"
                    size={24}
                    color={colors.defaultTextColor}
                    onLongPress={() => {
                      Alert.alert("Occupation");
                    }}
                  />
                  <Text adjustsFontSizeToFit style={styles.infoTextR}>
                    {userData.relationshipStatus
                      ? userData.relationshipStatus
                      : "Learning"}
                  </Text>
                </View>
                <View style={styles.langContain}>
                  <Text adjustsFontSizeToFit style={styles.infoTextFlag}>
                    {(userData.languageFrom === "es" && (
                      <CountryFlag
                        isoCode="es"
                        size={15}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                      (userData.languageFrom === "af" && (
                        <CountryFlag
                          isoCode="za"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "en" && (
                        <CountryFlag
                          isoCode="us"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "fr" && (
                        <CountryFlag
                          isoCode="fr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "de" && (
                        <CountryFlag
                          isoCode="de"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "it" && (
                        <CountryFlag
                          isoCode="it"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "pt" && (
                        <CountryFlag
                          isoCode="pt"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ru" && (
                        <CountryFlag
                          isoCode="ru"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "zh-CN" && (
                        <CountryFlag
                          isoCode="cn"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "zh-TW" && (
                        <CountryFlag
                          isoCode="cn"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ja" && (
                        <CountryFlag
                          isoCode="jp"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ar" && (
                        <CountryFlag
                          isoCode="sa"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hi" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "bn" && (
                        <CountryFlag
                          isoCode="bd"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "pa" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "te" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mr" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ta" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "gu" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "kn" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ml" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "si" && (
                        <CountryFlag
                          isoCode="lk"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "th" && (
                        <CountryFlag
                          isoCode="th"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "vi" && (
                        <CountryFlag
                          isoCode="vn"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "id" && (
                        <CountryFlag
                          isoCode="id"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ms" && (
                        <CountryFlag
                          isoCode="my"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "tr" && (
                        <CountryFlag
                          isoCode="tr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ko" && (
                        <CountryFlag
                          isoCode="kr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "el" && (
                        <CountryFlag
                          isoCode="gr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "pl" && (
                        <CountryFlag
                          isoCode="pl"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hu" && (
                        <CountryFlag
                          isoCode="hu"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ro" && (
                        <CountryFlag
                          isoCode="ro"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "bg" && (
                        <CountryFlag
                          isoCode="bg"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "cs" && (
                        <CountryFlag
                          isoCode="cz"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "da" && (
                        <CountryFlag
                          isoCode="dk"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "nl" && (
                        <CountryFlag
                          isoCode="nl"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "fi" && (
                        <CountryFlag
                          isoCode="fi"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "he" && (
                        <CountryFlag
                          isoCode="il"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "no" && (
                        <CountryFlag
                          isoCode="no"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sv" && (
                        <CountryFlag
                          isoCode="se"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "uk" && (
                        <CountryFlag
                          isoCode="ua"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hi" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "bn" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "pa" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "te" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mr" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "gu" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ta" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "kn" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ml" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sq" && (
                        <CountryFlag
                          isoCode="al"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "am" && (
                        <CountryFlag
                          isoCode="et"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hy" && (
                        <CountryFlag
                          isoCode="am"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "az" && (
                        <CountryFlag
                          isoCode="az"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ba" && (
                        <CountryFlag
                          isoCode="ba"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "eu" && (
                        <CountryFlag
                          isoCode="es"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "be" && (
                        <CountryFlag
                          isoCode="by"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "bs" && (
                        <CountryFlag
                          isoCode="ba"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ca" && (
                        <CountryFlag
                          isoCode="es"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ceb" && (
                        <CountryFlag
                          isoCode="ph"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "co" && (
                        <CountryFlag
                          isoCode="fr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hr" && (
                        <CountryFlag
                          isoCode="hr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "cs" && (
                        <CountryFlag
                          isoCode="cz"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "da" && (
                        <CountryFlag
                          isoCode="dk"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "nl" && (
                        <CountryFlag
                          isoCode="nl"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "eo" && (
                        <CountryFlag
                          isoCode="eo"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "et" && (
                        <CountryFlag
                          isoCode="ee"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "fi" && (
                        <CountryFlag
                          isoCode="fi"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "fr" && (
                        <CountryFlag
                          isoCode="fr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "fy" && (
                        <CountryFlag
                          isoCode="nl"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "gl" && (
                        <CountryFlag
                          isoCode="es"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ka" && (
                        <CountryFlag
                          isoCode="ge"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "de" && (
                        <CountryFlag
                          isoCode="de"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "el" && (
                        <CountryFlag
                          isoCode="gr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "gu" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ht" && (
                        <CountryFlag
                          isoCode="ht"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ha" && (
                        <CountryFlag
                          isoCode="ng"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "haw" && (
                        <CountryFlag
                          isoCode="us"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "he" && (
                        <CountryFlag
                          isoCode="il"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hi" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hmn" && (
                        <CountryFlag
                          isoCode="cn"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "hu" && (
                        <CountryFlag
                          isoCode="hu"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "is" && (
                        <CountryFlag
                          isoCode="is"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ig" && (
                        <CountryFlag
                          isoCode="ng"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "id" && (
                        <CountryFlag
                          isoCode="id"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ga" && (
                        <CountryFlag
                          isoCode="ie"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "it" && (
                        <CountryFlag
                          isoCode="it"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ja" && (
                        <CountryFlag
                          isoCode="jp"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "jw" && (
                        <CountryFlag
                          isoCode="id"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "kn" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "kk" && (
                        <CountryFlag
                          isoCode="kz"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "km" && (
                        <CountryFlag
                          isoCode="kh"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ko" && (
                        <CountryFlag
                          isoCode="kr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ku" && (
                        <CountryFlag
                          isoCode="iq"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ky" && (
                        <CountryFlag
                          isoCode="kg"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "lo" && (
                        <CountryFlag
                          isoCode="la"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "la" && (
                        <CountryFlag
                          isoCode="va"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "lv" && (
                        <CountryFlag
                          isoCode="lv"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "lt" && (
                        <CountryFlag
                          isoCode="lt"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "lb" && (
                        <CountryFlag
                          isoCode="lu"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mk" && (
                        <CountryFlag
                          isoCode="mk"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mg" && (
                        <CountryFlag
                          isoCode="mg"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ms" && (
                        <CountryFlag
                          isoCode="my"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ml" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mt" && (
                        <CountryFlag
                          isoCode="mt"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mi" && (
                        <CountryFlag
                          isoCode="nz"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mr" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "mn" && (
                        <CountryFlag
                          isoCode="mn"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "my" && (
                        <CountryFlag
                          isoCode="mm"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ne" && (
                        <CountryFlag
                          isoCode="np"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "no" && (
                        <CountryFlag
                          isoCode="no"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ny" && (
                        <CountryFlag
                          isoCode="mw"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ps" && (
                        <CountryFlag
                          isoCode="af"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "fa" && (
                        <CountryFlag
                          isoCode="ir"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "pl" && (
                        <CountryFlag
                          isoCode="pl"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "pt" && (
                        <CountryFlag
                          isoCode="pt"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "pa" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ro" && (
                        <CountryFlag
                          isoCode="ro"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ru" && (
                        <CountryFlag
                          isoCode="ru"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sm" && (
                        <CountryFlag
                          isoCode="ws"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "gd" && (
                        <CountryFlag
                          isoCode="gb"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sr" && (
                        <CountryFlag
                          isoCode="rs"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "st" && (
                        <CountryFlag
                          isoCode="ls"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sn" && (
                        <CountryFlag
                          isoCode="zw"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sd" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "si" && (
                        <CountryFlag
                          isoCode="lk"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sk" && (
                        <CountryFlag
                          isoCode="sk"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sl" && (
                        <CountryFlag
                          isoCode="si"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "so" && (
                        <CountryFlag
                          isoCode="so"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "es" && (
                        <CountryFlag
                          isoCode="es"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "su" && (
                        <CountryFlag
                          isoCode="id"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sw" && (
                        <CountryFlag
                          isoCode="tz"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "sv" && (
                        <CountryFlag
                          isoCode="se"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "tl" && (
                        <CountryFlag
                          isoCode="ph"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "tg" && (
                        <CountryFlag
                          isoCode="tj"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ta" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "te" && (
                        <CountryFlag
                          isoCode="in"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "th" && (
                        <CountryFlag
                          isoCode="th"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "tr" && (
                        <CountryFlag
                          isoCode="tr"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "uk" && (
                        <CountryFlag
                          isoCode="ua"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "ur" && (
                        <CountryFlag
                          isoCode="pk"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "uz" && (
                        <CountryFlag
                          isoCode="uz"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "vi" && (
                        <CountryFlag
                          isoCode="vn"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "cy" && (
                        <CountryFlag
                          isoCode="gb"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "xh" && (
                        <CountryFlag
                          isoCode="za"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "yi" && (
                        <CountryFlag
                          isoCode="de"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "yo" && (
                        <CountryFlag
                          isoCode="ng"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      )) ||
                      (userData.languageFrom === "zu" && (
                        <CountryFlag
                          isoCode="za"
                          size={15}
                          style={{ position: "absolute" }}
                        />
                      ))}
                  </Text>
                  <Text adjustsFontSizeToFit style={styles.languageText}>
                    {(userData.languageFrom === "af" && "Africaans") ||
                      (userData.languageFrom === "sq" && "Albanian") ||
                      (userData.languageFrom === "am" && "Amharic") ||
                      (userData.languageFrom === "ar" && "Arabic") ||
                      (userData.languageFrom === "hy" && "Armenian") ||
                      (userData.languageFrom === "az" && "Azerbaijani") ||
                      (userData.languageFrom === "eu" && "Basque") ||
                      (userData.languageFrom === "be" && "Belarusian") ||
                      (userData.languageFrom === "bn" && "Bengali") ||
                      (userData.languageFrom === "bs" && "Bosnian") ||
                      (userData.languageFrom === "bg" && "Bulgarian") ||
                      (userData.languageFrom === "my" && "Burmese") ||
                      (userData.languageFrom === "ca" && "Catalan") ||
                      (userData.languageFrom === "ceb" && "Cebuano") ||
                      (userData.languageFrom === "ny" && "Chichewa") ||
                      (userData.languageFrom === "zh-CN" &&
                        "Chinese (Simplified)") ||
                      (userData.languageFrom === "zh-TW" &&
                        "Chinese (Traditional)") ||
                      (userData.languageFrom === "co" && "Corsican") ||
                      (userData.languageFrom === "hr" && "Croatian") ||
                      (userData.languageFrom === "cs" && "Czech") ||
                      (userData.languageFrom === "da" && "Danish") ||
                      (userData.languageFrom === "nl" && "Dutch") ||
                      (userData.languageFrom === "en" && "English") ||
                      (userData.languageFrom === "eo" && "Esperanto") ||
                      (userData.languageFrom === "et" && "Estonian") ||
                      (userData.languageFrom === "tl" && "Filipino") ||
                      (userData.languageFrom === "fi" && "Finnish") ||
                      (userData.languageFrom === "fr" && "French") ||
                      (userData.languageFrom === "fy" && "Frisian") ||
                      (userData.languageFrom === "gl" && "Galician") ||
                      (userData.languageFrom === "ka" && "Georgian") ||
                      (userData.languageFrom === "de" && "German") ||
                      (userData.languageFrom === "el" && "Greek") ||
                      (userData.languageFrom === "gu" && "Gujarati") ||
                      (userData.languageFrom === "ht" && "Haitian Creole") ||
                      (userData.languageFrom === "ha" && "Hausa") ||
                      (userData.languageFrom === "haw" && "Hawaiian") ||
                      (userData.languageFrom === "iw" && "Hebrew") ||
                      (userData.languageFrom === "hi" && "Hindi") ||
                      (userData.languageFrom === "hmn" && "Hmong") ||
                      (userData.languageFrom === "hu" && "Hungarian") ||
                      (userData.languageFrom === "is" && "Icelandic") ||
                      (userData.languageFrom === "ig" && "Igbo") ||
                      (userData.languageFrom === "id" && "Indonesian") ||
                      (userData.languageFrom === "ga" && "Irish") ||
                      (userData.languageFrom === "it" && "Italian") ||
                      (userData.languageFrom === "ja" && "Japanese") ||
                      (userData.languageFrom === "jw" && "Javanese") ||
                      (userData.languageFrom === "kn" && "Kannada") ||
                      (userData.languageFrom === "kk" && "Kazakh") ||
                      (userData.languageFrom === "km" && "Khmer") ||
                      (userData.languageFrom === "ko" && "Korean") ||
                      (userData.languageFrom === "ku" &&
                        "Kurdish (Kurmanji)") ||
                      (userData.languageFrom === "ky" && "Kyrgyz") ||
                      (userData.languageFrom === "lo" && "Lao") ||
                      (userData.languageFrom === "la" && "Latin") ||
                      (userData.languageFrom === "lv" && "Latvian") ||
                      (userData.languageFrom === "lt" && "Lithuanian") ||
                      (userData.languageFrom === "lb" && "Luxembourgish") ||
                      (userData.languageFrom === "mk" && "Macedonian") ||
                      (userData.languageFrom === "mg" && "Malagasy") ||
                      (userData.languageFrom === "ms" && "Malay") ||
                      (userData.languageFrom === "ml" && "Malayalam") ||
                      (userData.languageFrom === "mt" && "Maltese") ||
                      (userData.languageFrom === "mi" && "Maori") ||
                      (userData.languageFrom === "mr" && "Marathi") ||
                      (userData.languageFrom === "mn" && "Mongolian") ||
                      (userData.languageFrom === "my" && "Myanmar (Burmese)") ||
                      (userData.languageFrom === "ne" && "Nepali") ||
                      (userData.languageFrom === "no" && "Norwegian") ||
                      (userData.languageFrom === "ps" && "Pashto") ||
                      (userData.languageFrom === "fa" && "Persian") ||
                      (userData.languageFrom === "pl" && "Polish") ||
                      (userData.languageFrom === "pt" && "Portuguese") ||
                      (userData.languageFrom === "ma" && "Punjabi") ||
                      (userData.languageFrom === "ro" && "Romanian") ||
                      (userData.languageFrom === "ru" && "Russian") ||
                      (userData.languageFrom === "sm" && "Samoan") ||
                      (userData.languageFrom === "gd" && "Scots Gaelic") ||
                      (userData.languageFrom === "sr" && "Serbian") ||
                      (userData.languageFrom === "st" && "Sesotho") ||
                      (userData.languageFrom === "sn" && "Shona") ||
                      (userData.languageFrom === "sd" && "Sindhi") ||
                      (userData.languageFrom === "si" && "Sinhala") ||
                      (userData.languageFrom === "sk" && "Slovak") ||
                      (userData.languageFrom === "sl" && "Slovenian") ||
                      (userData.languageFrom === "so" && "Somali") ||
                      (userData.languageFrom === "es" && "Spanish") ||
                      (userData.languageFrom === "su" && "Sundanese") ||
                      (userData.languageFrom === "sw" && "Swahili") ||
                      (userData.languageFrom === "sv" && "Swedish") ||
                      (userData.languageFrom === "tg" && "Tajik") ||
                      (userData.languageFrom === "ta" && "Tamil") ||
                      (userData.languageFrom === "te" && "Telugu") ||
                      (userData.languageFrom === "th" && "Thai") ||
                      (userData.languageFrom === "tr" && "Turkish") ||
                      (userData.languageFrom === "uk" && "Ukrainian") ||
                      (userData.languageFrom === "ur" && "Urdu") ||
                      (userData.languageFrom === "uz" && "Uzbek") ||
                      (userData.languageFrom === "vi" && "Vietnamese") ||
                      (userData.languageFrom === "cy" && "Welsh") ||
                      (userData.languageFrom === "xh" && "Xhosa") ||
                      (userData.languageFrom === "yi" && "Yiddish") ||
                      (userData.languageFrom === "yo" && "Yoruba") ||
                      (userData.languageFrom === "zu" && "Zulu")}
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onLongPress={() =>
                    Alert.alert(
                      "Settings",
                      "Change your Language settings here."
                    )
                  }
                  onPress={() => navigation.navigate("Settings")}
                >
                  <View style={styles.settingButtonContainer}>
                    <Ionicons
                      name="md-settings-sharp"
                      size={24}
                      color={colors.orange}
                    />
                  </View>
                  <View style={styles.imageContain}>
                    {userData.profilePic ? (
                      <CachedImage
                        source={{ uri: userData.profilePic }}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/defaultPic.png")}
                        style={styles.image}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.interests}>
            <Text adjustsFontSizeToFit style={styles.textLearn}></Text>
            <View style={styles.interestsContainer}>
              <View style={styles.langContainTwo}>
                <Text style={styles.infoTextTwo}>
                  {(userData.language === "es" && (
                    <CountryFlag
                      isoCode="es"
                      size={20}
                      style={{ position: "absolute" }}
                    />
                  )) ||
                    (userData.language === "af" && (
                      <CountryFlag
                        isoCode="za"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "en" && (
                      <CountryFlag
                        isoCode="us"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "fr" && (
                      <CountryFlag
                        isoCode="fr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "de" && (
                      <CountryFlag
                        isoCode="de"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "it" && (
                      <CountryFlag
                        isoCode="it"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "pt" && (
                      <CountryFlag
                        isoCode="pt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ru" && (
                      <CountryFlag
                        isoCode="ru"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "zh-CN" && (
                      <CountryFlag
                        isoCode="cn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "zh-TW" && (
                      <CountryFlag
                        isoCode="cn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ja" && (
                      <CountryFlag
                        isoCode="jp"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ar" && (
                      <CountryFlag
                        isoCode="sa"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hi" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "bn" && (
                      <CountryFlag
                        isoCode="bd"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "pa" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "te" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mr" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ta" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "gu" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "kn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ml" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "si" && (
                      <CountryFlag
                        isoCode="lk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "th" && (
                      <CountryFlag
                        isoCode="th"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "vi" && (
                      <CountryFlag
                        isoCode="vn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "id" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ms" && (
                      <CountryFlag
                        isoCode="my"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "tr" && (
                      <CountryFlag
                        isoCode="tr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ko" && (
                      <CountryFlag
                        isoCode="kr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "el" && (
                      <CountryFlag
                        isoCode="gr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "pl" && (
                      <CountryFlag
                        isoCode="pl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hu" && (
                      <CountryFlag
                        isoCode="hu"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ro" && (
                      <CountryFlag
                        isoCode="ro"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "bg" && (
                      <CountryFlag
                        isoCode="bg"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "cs" && (
                      <CountryFlag
                        isoCode="cz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "da" && (
                      <CountryFlag
                        isoCode="dk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "nl" && (
                      <CountryFlag
                        isoCode="nl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "fi" && (
                      <CountryFlag
                        isoCode="fi"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "he" && (
                      <CountryFlag
                        isoCode="il"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "no" && (
                      <CountryFlag
                        isoCode="no"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sv" && (
                      <CountryFlag
                        isoCode="se"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "uk" && (
                      <CountryFlag
                        isoCode="ua"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hi" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "bn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "pa" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "te" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mr" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "gu" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ta" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "kn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ml" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sq" && (
                      <CountryFlag
                        isoCode="al"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "am" && (
                      <CountryFlag
                        isoCode="et"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hy" && (
                      <CountryFlag
                        isoCode="am"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "az" && (
                      <CountryFlag
                        isoCode="az"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ba" && (
                      <CountryFlag
                        isoCode="ba"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "eu" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "be" && (
                      <CountryFlag
                        isoCode="by"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "bs" && (
                      <CountryFlag
                        isoCode="ba"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ca" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ceb" && (
                      <CountryFlag
                        isoCode="ph"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "co" && (
                      <CountryFlag
                        isoCode="fr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hr" && (
                      <CountryFlag
                        isoCode="hr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "cs" && (
                      <CountryFlag
                        isoCode="cz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "da" && (
                      <CountryFlag
                        isoCode="dk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "nl" && (
                      <CountryFlag
                        isoCode="nl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "eo" && (
                      <CountryFlag
                        isoCode="eo"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "et" && (
                      <CountryFlag
                        isoCode="ee"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "fi" && (
                      <CountryFlag
                        isoCode="fi"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "fr" && (
                      <CountryFlag
                        isoCode="fr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "fy" && (
                      <CountryFlag
                        isoCode="nl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "gl" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ka" && (
                      <CountryFlag
                        isoCode="ge"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "de" && (
                      <CountryFlag
                        isoCode="de"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "el" && (
                      <CountryFlag
                        isoCode="gr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "gu" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ht" && (
                      <CountryFlag
                        isoCode="ht"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ha" && (
                      <CountryFlag
                        isoCode="ng"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "haw" && (
                      <CountryFlag
                        isoCode="us"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "he" && (
                      <CountryFlag
                        isoCode="il"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hi" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hmn" && (
                      <CountryFlag
                        isoCode="cn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "hu" && (
                      <CountryFlag
                        isoCode="hu"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "is" && (
                      <CountryFlag
                        isoCode="is"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ig" && (
                      <CountryFlag
                        isoCode="ng"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "id" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ga" && (
                      <CountryFlag
                        isoCode="ie"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "it" && (
                      <CountryFlag
                        isoCode="it"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ja" && (
                      <CountryFlag
                        isoCode="jp"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "jw" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "kn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "kk" && (
                      <CountryFlag
                        isoCode="kz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "km" && (
                      <CountryFlag
                        isoCode="kh"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ko" && (
                      <CountryFlag
                        isoCode="kr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ku" && (
                      <CountryFlag
                        isoCode="iq"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ky" && (
                      <CountryFlag
                        isoCode="kg"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "lo" && (
                      <CountryFlag
                        isoCode="la"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "la" && (
                      <CountryFlag
                        isoCode="va"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "lv" && (
                      <CountryFlag
                        isoCode="lv"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "lt" && (
                      <CountryFlag
                        isoCode="lt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "lb" && (
                      <CountryFlag
                        isoCode="lu"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mk" && (
                      <CountryFlag
                        isoCode="mk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mg" && (
                      <CountryFlag
                        isoCode="mg"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ms" && (
                      <CountryFlag
                        isoCode="my"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ml" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mt" && (
                      <CountryFlag
                        isoCode="mt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mi" && (
                      <CountryFlag
                        isoCode="nz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mr" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "mn" && (
                      <CountryFlag
                        isoCode="mn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "my" && (
                      <CountryFlag
                        isoCode="mm"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ne" && (
                      <CountryFlag
                        isoCode="np"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "no" && (
                      <CountryFlag
                        isoCode="no"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ny" && (
                      <CountryFlag
                        isoCode="mw"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ps" && (
                      <CountryFlag
                        isoCode="af"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "fa" && (
                      <CountryFlag
                        isoCode="ir"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "pl" && (
                      <CountryFlag
                        isoCode="pl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "pt" && (
                      <CountryFlag
                        isoCode="pt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "pa" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ro" && (
                      <CountryFlag
                        isoCode="ro"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ru" && (
                      <CountryFlag
                        isoCode="ru"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sm" && (
                      <CountryFlag
                        isoCode="ws"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "gd" && (
                      <CountryFlag
                        isoCode="gb"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sr" && (
                      <CountryFlag
                        isoCode="rs"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "st" && (
                      <CountryFlag
                        isoCode="ls"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sn" && (
                      <CountryFlag
                        isoCode="zw"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sd" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "si" && (
                      <CountryFlag
                        isoCode="lk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sk" && (
                      <CountryFlag
                        isoCode="sk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sl" && (
                      <CountryFlag
                        isoCode="si"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "so" && (
                      <CountryFlag
                        isoCode="so"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "es" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "su" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sw" && (
                      <CountryFlag
                        isoCode="tz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "sv" && (
                      <CountryFlag
                        isoCode="se"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "tl" && (
                      <CountryFlag
                        isoCode="ph"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "tg" && (
                      <CountryFlag
                        isoCode="tj"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ta" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "te" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "th" && (
                      <CountryFlag
                        isoCode="th"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "tr" && (
                      <CountryFlag
                        isoCode="tr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "uk" && (
                      <CountryFlag
                        isoCode="ua"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "ur" && (
                      <CountryFlag
                        isoCode="pk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "uz" && (
                      <CountryFlag
                        isoCode="uz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "vi" && (
                      <CountryFlag
                        isoCode="vn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "cy" && (
                      <CountryFlag
                        isoCode="gb"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "xh" && (
                      <CountryFlag
                        isoCode="za"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "yi" && (
                      <CountryFlag
                        isoCode="de"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "yo" && (
                      <CountryFlag
                        isoCode="ng"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.language === "zu" && (
                      <CountryFlag
                        isoCode="za"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    ))}
                </Text>
                <TouchableOpacity
                  onLongPress={() => Alert.alert("Tap to change language")}
                  // onPress={seeSecondLanguageMastered}
                  onPress={() => {
                    navigation.navigate("Settings");
                  }}
                >
                  <Text adjustsFontSizeToFit style={styles.languageTextTwo}>
                    {(userData.language === "af" && "Africaans") ||
                      (userData.language === "sq" && "Albanian") ||
                      (userData.language === "am" && "Amharic") ||
                      (userData.language === "ar" && "Arabic") ||
                      (userData.language === "ba" && "Bashkir") ||
                      (userData.language === "hy" && "Armenian") ||
                      (userData.language === "az" && "Azerbaijani") ||
                      (userData.language === "eu" && "Basque") ||
                      (userData.language === "be" && "Belarusian") ||
                      (userData.language === "bn" && "Bengali") ||
                      (userData.language === "bs" && "Bosnian") ||
                      (userData.language === "bg" && "Bulgarian") ||
                      (userData.language === "my" && "Burmese") ||
                      (userData.language === "ca" && "Catalan") ||
                      (userData.language === "ceb" && "Cebuano") ||
                      (userData.language === "ny" && "Chichewa") ||
                      (userData.language === "zh-CN" && "Chinese") ||
                      (userData.language === "zh-TW" && "Chinese") ||
                      (userData.language === "co" && "Corsican") ||
                      (userData.language === "hr" && "Croatian") ||
                      (userData.language === "cs" && "Czech") ||
                      (userData.language === "da" && "Danish") ||
                      (userData.language === "nl" && "Dutch") ||
                      (userData.language === "en" && "English") ||
                      (userData.language === "eo" && "Esperanto") ||
                      (userData.language === "et" && "Estonian") ||
                      (userData.language === "tl" && "Filipino") ||
                      (userData.language === "fi" && "Finnish") ||
                      (userData.language === "fr" && "French") ||
                      (userData.language === "fy" && "Frisian") ||
                      (userData.language === "gl" && "Galician") ||
                      (userData.language === "ka" && "Georgian") ||
                      (userData.language === "de" && "German") ||
                      (userData.language === "el" && "Greek") ||
                      (userData.language === "gu" && "Gujarati") ||
                      (userData.language === "ht" && "Haitian Creole") ||
                      (userData.language === "ha" && "Hausa") ||
                      (userData.language === "haw" && "Hawaiian") ||
                      (userData.language === "iw" && "Hebrew") ||
                      (userData.language === "hi" && "Hindi") ||
                      (userData.language === "hmn" && "Hmong") ||
                      (userData.language === "hu" && "Hungarian") ||
                      (userData.language === "is" && "Icelandic") ||
                      (userData.language === "ig" && "Igbo") ||
                      (userData.language === "id" && "Indonesian") ||
                      (userData.language === "ga" && "Irish") ||
                      (userData.language === "it" && "Italian") ||
                      (userData.language === "ja" && "Japanese") ||
                      (userData.language === "jw" && "Javanese") ||
                      (userData.language === "kn" && "Kannada") ||
                      (userData.language === "kk" && "Kazakh") ||
                      (userData.language === "km" && "Khmer") ||
                      (userData.language === "ko" && "Korean") ||
                      (userData.language === "ku" && "Kurdish (Kurmanji)") ||
                      (userData.language === "ky" && "Kyrgyz") ||
                      (userData.language === "lo" && "Lao") ||
                      (userData.language === "la" && "Latin") ||
                      (userData.language === "lv" && "Latvian") ||
                      (userData.language === "lt" && "Lithuanian") ||
                      (userData.language === "lb" && "Luxembourgish") ||
                      (userData.language === "mk" && "Macedonian") ||
                      (userData.language === "mg" && "Malagasy") ||
                      (userData.language === "ms" && "Malay") ||
                      (userData.language === "ml" && "Malayalam") ||
                      (userData.language === "mt" && "Maltese") ||
                      (userData.language === "mi" && "Maori") ||
                      (userData.language === "mr" && "Marathi") ||
                      (userData.language === "mn" && "Mongolian") ||
                      (userData.language === "my" && "Myanmar (Burmese)") ||
                      (userData.language === "ne" && "Nepali") ||
                      (userData.language === "no" && "Norwegian") ||
                      (userData.language === "ps" && "Pashto") ||
                      (userData.language === "fa" && "Persian") ||
                      (userData.language === "pl" && "Polish") ||
                      (userData.language === "pt" && "Portuguese") ||
                      (userData.language === "ma" && "Punjabi") ||
                      (userData.language === "ro" && "Romanian") ||
                      (userData.language === "ru" && "Russian") ||
                      (userData.language === "sm" && "Samoan") ||
                      (userData.language === "gd" && "Scots Gaelic") ||
                      (userData.language === "sr" && "Serbian") ||
                      (userData.language === "st" && "Sesotho") ||
                      (userData.language === "sn" && "Shona") ||
                      (userData.language === "sd" && "Sindhi") ||
                      (userData.language === "si" && "Sinhala") ||
                      (userData.language === "sk" && "Slovak") ||
                      (userData.language === "sl" && "Slovenian") ||
                      (userData.language === "so" && "Somali") ||
                      (userData.language === "es" && "Spanish") ||
                      (userData.language === "su" && "Sundanese") ||
                      (userData.language === "sw" && "Swahili") ||
                      (userData.language === "sv" && "Swedish") ||
                      (userData.language === "tg" && "Tajik") ||
                      (userData.language === "ta" && "Tamil") ||
                      (userData.language === "te" && "Telugu") ||
                      (userData.language === "th" && "Thai") ||
                      (userData.language === "tr" && "Turkish") ||
                      (userData.language === "uk" && "Ukrainian") ||
                      (userData.language === "ur" && "Urdu") ||
                      (userData.language === "uz" && "Uzbek") ||
                      (userData.language === "vi" && "Vietnamese") ||
                      (userData.language === "cy" && "Welsh") ||
                      (userData.language === "xh" && "Xhosa") ||
                      (userData.language === "yi" && "Yiddish") ||
                      (userData.language === "yo" && "Yoruba") ||
                      (userData.language === "zu" && "Zulu")}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.at}> {"    "}</Text>
                <Text style={styles.infoTextTwo}>
                  {(userData.languageTwo === "es" && (
                    <CountryFlag
                      isoCode="es"
                      size={20}
                      style={{ position: "absolute" }}
                    />
                  )) ||
                    (userData.languageTwo === "af" && (
                      <CountryFlag
                        isoCode="za"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "en" && (
                      <CountryFlag
                        isoCode="us"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "fr" && (
                      <CountryFlag
                        isoCode="fr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "de" && (
                      <CountryFlag
                        isoCode="de"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "it" && (
                      <CountryFlag
                        isoCode="it"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "pt" && (
                      <CountryFlag
                        isoCode="pt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ru" && (
                      <CountryFlag
                        isoCode="ru"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "zh-CN" && (
                      <CountryFlag
                        isoCode="cn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "zh-TW" && (
                      <CountryFlag
                        isoCode="cn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ja" && (
                      <CountryFlag
                        isoCode="jp"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ar" && (
                      <CountryFlag
                        isoCode="sa"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hi" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "bn" && (
                      <CountryFlag
                        isoCode="bd"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "pa" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "te" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mr" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ta" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "gu" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "kn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ml" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "si" && (
                      <CountryFlag
                        isoCode="lk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "th" && (
                      <CountryFlag
                        isoCode="th"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "vi" && (
                      <CountryFlag
                        isoCode="vn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "id" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ms" && (
                      <CountryFlag
                        isoCode="my"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "tr" && (
                      <CountryFlag
                        isoCode="tr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ko" && (
                      <CountryFlag
                        isoCode="kr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "el" && (
                      <CountryFlag
                        isoCode="gr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "pl" && (
                      <CountryFlag
                        isoCode="pl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hu" && (
                      <CountryFlag
                        isoCode="hu"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ro" && (
                      <CountryFlag
                        isoCode="ro"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "bg" && (
                      <CountryFlag
                        isoCode="bg"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "cs" && (
                      <CountryFlag
                        isoCode="cz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "da" && (
                      <CountryFlag
                        isoCode="dk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "nl" && (
                      <CountryFlag
                        isoCode="nl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "fi" && (
                      <CountryFlag
                        isoCode="fi"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "he" && (
                      <CountryFlag
                        isoCode="il"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "no" && (
                      <CountryFlag
                        isoCode="no"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sv" && (
                      <CountryFlag
                        isoCode="se"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "uk" && (
                      <CountryFlag
                        isoCode="ua"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hi" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "bn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "pa" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "te" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mr" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "gu" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ta" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "kn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ml" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sq" && (
                      <CountryFlag
                        isoCode="al"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "am" && (
                      <CountryFlag
                        isoCode="et"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hy" && (
                      <CountryFlag
                        isoCode="am"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "az" && (
                      <CountryFlag
                        isoCode="az"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ba" && (
                      <CountryFlag
                        isoCode="ba"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "eu" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "be" && (
                      <CountryFlag
                        isoCode="by"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "bs" && (
                      <CountryFlag
                        isoCode="ba"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ca" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ceb" && (
                      <CountryFlag
                        isoCode="ph"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "co" && (
                      <CountryFlag
                        isoCode="fr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hr" && (
                      <CountryFlag
                        isoCode="hr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "cs" && (
                      <CountryFlag
                        isoCode="cz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "da" && (
                      <CountryFlag
                        isoCode="dk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "nl" && (
                      <CountryFlag
                        isoCode="nl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "eo" && (
                      <CountryFlag
                        isoCode="eo"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "et" && (
                      <CountryFlag
                        isoCode="ee"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "fi" && (
                      <CountryFlag
                        isoCode="fi"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "fr" && (
                      <CountryFlag
                        isoCode="fr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "fy" && (
                      <CountryFlag
                        isoCode="nl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "gl" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ka" && (
                      <CountryFlag
                        isoCode="ge"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "de" && (
                      <CountryFlag
                        isoCode="de"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "el" && (
                      <CountryFlag
                        isoCode="gr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "gu" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ht" && (
                      <CountryFlag
                        isoCode="ht"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ha" && (
                      <CountryFlag
                        isoCode="ng"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "haw" && (
                      <CountryFlag
                        isoCode="us"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "he" && (
                      <CountryFlag
                        isoCode="il"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hi" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hmn" && (
                      <CountryFlag
                        isoCode="cn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "hu" && (
                      <CountryFlag
                        isoCode="hu"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "is" && (
                      <CountryFlag
                        isoCode="is"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ig" && (
                      <CountryFlag
                        isoCode="ng"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "id" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ga" && (
                      <CountryFlag
                        isoCode="ie"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "it" && (
                      <CountryFlag
                        isoCode="it"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ja" && (
                      <CountryFlag
                        isoCode="jp"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "jw" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "kn" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "kk" && (
                      <CountryFlag
                        isoCode="kz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "km" && (
                      <CountryFlag
                        isoCode="kh"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ko" && (
                      <CountryFlag
                        isoCode="kr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ku" && (
                      <CountryFlag
                        isoCode="iq"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ky" && (
                      <CountryFlag
                        isoCode="kg"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "lo" && (
                      <CountryFlag
                        isoCode="la"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "la" && (
                      <CountryFlag
                        isoCode="va"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "lv" && (
                      <CountryFlag
                        isoCode="lv"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "lt" && (
                      <CountryFlag
                        isoCode="lt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "lb" && (
                      <CountryFlag
                        isoCode="lu"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mk" && (
                      <CountryFlag
                        isoCode="mk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mg" && (
                      <CountryFlag
                        isoCode="mg"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ms" && (
                      <CountryFlag
                        isoCode="my"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ml" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mt" && (
                      <CountryFlag
                        isoCode="mt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mi" && (
                      <CountryFlag
                        isoCode="nz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mr" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "mn" && (
                      <CountryFlag
                        isoCode="mn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "my" && (
                      <CountryFlag
                        isoCode="mm"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ne" && (
                      <CountryFlag
                        isoCode="np"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "no" && (
                      <CountryFlag
                        isoCode="no"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ny" && (
                      <CountryFlag
                        isoCode="mw"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ps" && (
                      <CountryFlag
                        isoCode="af"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "fa" && (
                      <CountryFlag
                        isoCode="ir"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "pl" && (
                      <CountryFlag
                        isoCode="pl"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "pt" && (
                      <CountryFlag
                        isoCode="pt"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "pa" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ro" && (
                      <CountryFlag
                        isoCode="ro"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ru" && (
                      <CountryFlag
                        isoCode="ru"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sm" && (
                      <CountryFlag
                        isoCode="ws"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "gd" && (
                      <CountryFlag
                        isoCode="gb"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sr" && (
                      <CountryFlag
                        isoCode="rs"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "st" && (
                      <CountryFlag
                        isoCode="ls"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sn" && (
                      <CountryFlag
                        isoCode="zw"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sd" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "si" && (
                      <CountryFlag
                        isoCode="lk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sk" && (
                      <CountryFlag
                        isoCode="sk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sl" && (
                      <CountryFlag
                        isoCode="si"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "so" && (
                      <CountryFlag
                        isoCode="so"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "es" && (
                      <CountryFlag
                        isoCode="es"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "su" && (
                      <CountryFlag
                        isoCode="id"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sw" && (
                      <CountryFlag
                        isoCode="tz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "sv" && (
                      <CountryFlag
                        isoCode="se"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "tl" && (
                      <CountryFlag
                        isoCode="ph"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "tg" && (
                      <CountryFlag
                        isoCode="tj"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ta" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "te" && (
                      <CountryFlag
                        isoCode="in"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "th" && (
                      <CountryFlag
                        isoCode="th"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "tr" && (
                      <CountryFlag
                        isoCode="tr"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "uk" && (
                      <CountryFlag
                        isoCode="ua"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "ur" && (
                      <CountryFlag
                        isoCode="pk"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "uz" && (
                      <CountryFlag
                        isoCode="uz"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "vi" && (
                      <CountryFlag
                        isoCode="vn"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "cy" && (
                      <CountryFlag
                        isoCode="gb"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "xh" && (
                      <CountryFlag
                        isoCode="za"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "yi" && (
                      <CountryFlag
                        isoCode="de"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "yo" && (
                      <CountryFlag
                        isoCode="ng"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    )) ||
                    (userData.languageTwo === "zu" && (
                      <CountryFlag
                        isoCode="za"
                        size={20}
                        style={{ position: "absolute" }}
                      />
                    ))}
                </Text>
                <TouchableOpacity
                  onLongPress={() => Alert.alert("Tap to change language")}
                  // onPress={seeSecondLanguageMastered}
                  onPress={() => {
                    navigation.navigate("Settings");
                  }}
                >
                  <Text adjustsFontSizeToFit style={styles.languageTextTwo}>
                    {(userData.languageTwo === "af" && "Africaans") ||
                      (userData.languageTwo === "sq" && "Albanian") ||
                      (userData.languageTwo === "am" && "Amharic") ||
                      (userData.languageTwo === "ar" && "Arabic") ||
                      (userData.languageTwo === "hy" && "Armenian") ||
                      (userData.languageTwo === "az" && "Azerbaijani") ||
                      (userData.languageTwo === "eu" && "Basque") ||
                      (userData.languageTwo === "be" && "Belarusian") ||
                      (userData.languageTwo === "bn" && "Bengali") ||
                      (userData.languageTwo === "bs" && "Bosnian") ||
                      (userData.languageTwo === "bg" && "Bulgarian") ||
                      (userData.languageTwo === "my" && "Burmese") ||
                      (userData.languageTwo === "ca" && "Catalan") ||
                      (userData.languageTwo === "ceb" && "Cebuano") ||
                      (userData.languageTwo === "ny" && "Chichewa") ||
                      (userData.languageTwo === "zh-CN" && "Chinese") ||
                      (userData.languageTwo === "zh-TW" && "Chinese") ||
                      (userData.languageTwo === "co" && "Corsican") ||
                      (userData.languageTwo === "hr" && "Croatian") ||
                      (userData.languageTwo === "cs" && "Czech") ||
                      (userData.languageTwo === "da" && "Danish") ||
                      (userData.languageTwo === "nl" && "Dutch") ||
                      (userData.languageTwo === "en" && "English") ||
                      (userData.languageTwo === "eo" && "Esperanto") ||
                      (userData.languageTwo === "et" && "Estonian") ||
                      (userData.languageTwo === "tl" && "Filipino") ||
                      (userData.languageTwo === "fi" && "Finnish") ||
                      (userData.languageTwo === "fr" && "French") ||
                      (userData.languageTwo === "fy" && "Frisian") ||
                      (userData.languageTwo === "gl" && "Galician") ||
                      (userData.languageTwo === "ka" && "Georgian") ||
                      (userData.languageTwo === "de" && "German") ||
                      (userData.languageTwo === "el" && "Greek") ||
                      (userData.languageTwo === "gu" && "Gujarati") ||
                      (userData.languageTwo === "ht" && "Haitian Creole") ||
                      (userData.languageTwo === "ha" && "Hausa") ||
                      (userData.languageTwo === "haw" && "Hawaiian") ||
                      (userData.languageTwo === "iw" && "Hebrew") ||
                      (userData.languageTwo === "hi" && "Hindi") ||
                      (userData.languageTwo === "hmn" && "Hmong") ||
                      (userData.languageTwo === "hu" && "Hungarian") ||
                      (userData.languageTwo === "is" && "Icelandic") ||
                      (userData.languageTwo === "ig" && "Igbo") ||
                      (userData.languageTwo === "id" && "Indonesian") ||
                      (userData.languageTwo === "ga" && "Irish") ||
                      (userData.languageTwo === "it" && "Italian") ||
                      (userData.languageTwo === "ja" && "Japanese") ||
                      (userData.languageTwo === "jw" && "Javanese") ||
                      (userData.languageTwo === "kn" && "Kannada") ||
                      (userData.languageTwo === "kk" && "Kazakh") ||
                      (userData.languageTwo === "km" && "Khmer") ||
                      (userData.languageTwo === "ko" && "Korean") ||
                      (userData.languageTwo === "ku" && "Kurdish (Kurmanji)") ||
                      (userData.languageTwo === "ky" && "Kyrgyz") ||
                      (userData.languageTwo === "lo" && "Lao") ||
                      (userData.languageTwo === "la" && "Latin") ||
                      (userData.languageTwo === "lv" && "Latvian") ||
                      (userData.languageTwo === "lt" && "Lithuanian") ||
                      (userData.languageTwo === "lb" && "Luxembourgish") ||
                      (userData.languageTwo === "mk" && "Macedonian") ||
                      (userData.languageTwo === "mg" && "Malagasy") ||
                      (userData.languageTwo === "ms" && "Malay") ||
                      (userData.languageTwo === "ml" && "Malayalam") ||
                      (userData.languageTwo === "mt" && "Maltese") ||
                      (userData.languageTwo === "mi" && "Maori") ||
                      (userData.languageTwo === "mr" && "Marathi") ||
                      (userData.languageTwo === "mn" && "Mongolian") ||
                      (userData.languageTwo === "my" && "Myanmar (Burmese)") ||
                      (userData.languageTwo === "ne" && "Nepali") ||
                      (userData.languageTwo === "no" && "Norwegian") ||
                      (userData.languageTwo === "ps" && "Pashto") ||
                      (userData.languageTwo === "fa" && "Persian") ||
                      (userData.languageTwo === "pl" && "Polish") ||
                      (userData.languageTwo === "pt" && "Portuguese") ||
                      (userData.languageTwo === "ma" && "Punjabi") ||
                      (userData.languageTwo === "ro" && "Romanian") ||
                      (userData.languageTwo === "ru" && "Russian") ||
                      (userData.languageTwo === "sm" && "Samoan") ||
                      (userData.languageTwo === "gd" && "Scots Gaelic") ||
                      (userData.languageTwo === "sr" && "Serbian") ||
                      (userData.languageTwo === "st" && "Sesotho") ||
                      (userData.languageTwo === "sn" && "Shona") ||
                      (userData.languageTwo === "sd" && "Sindhi") ||
                      (userData.languageTwo === "si" && "Sinhala") ||
                      (userData.languageTwo === "sk" && "Slovak") ||
                      (userData.languageTwo === "sl" && "Slovenian") ||
                      (userData.languageTwo === "so" && "Somali") ||
                      (userData.languageTwo === "es" && "Spanish") ||
                      (userData.languageTwo === "su" && "Sundanese") ||
                      (userData.languageTwo === "sw" && "Swahili") ||
                      (userData.languageTwo === "sv" && "Swedish") ||
                      (userData.languageTwo === "tg" && "Tajik") ||
                      (userData.languageTwo === "ta" && "Tamil") ||
                      (userData.languageTwo === "te" && "Telugu") ||
                      (userData.languageTwo === "th" && "Thai") ||
                      (userData.languageTwo === "tr" && "Turkish") ||
                      (userData.languageTwo === "uk" && "Ukrainian") ||
                      (userData.languageTwo === "ur" && "Urdu") ||
                      (userData.languageTwo === "uz" && "Uzbek") ||
                      (userData.languageTwo === "vi" && "Vietnamese") ||
                      (userData.languageTwo === "cy" && "Welsh") ||
                      (userData.languageTwo === "xh" && "Xhosa") ||
                      (userData.languageTwo === "yi" && "Yiddish") ||
                      (userData.languageTwo === "yo" && "Yoruba") ||
                      (userData.languageTwo === "zu" && "Zulu")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.locationBC}>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                  }}
                  onLongPress={() => Alert.alert("Status to share with people")}
                  // go to langiddy.com
                  onPress={() => {
                    Linking.openURL("https://langiddy.com/tutorials");
                  }}
                >
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={24}
                    color={colors.orange}
                  />
                  <Text
                    style={{
                      color: colors.orange,
                      fontFamily: "regular",
                    }}
                  >
                    Tutorials
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.location}></View>

              <InputAbout
                id="status"
                icon={"comment-text-outline"}
                label={" "}
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                blurOnSubmit={true}
                placeholderMultiLine={true}
                placeholder={
                  "Let people know what you want to talk about today."
                }
                iconPack={MaterialCommunityIcons}
                iconSize={26}
                onInputChanged={inputChangedHandler}
                error={formState.inputValidities.status}
                initialState={userData.status}
                initialValue={userData.status}
                maxLength={80}
                numberOfLines={3}
                multiline={true}
                showsVerticalScrollIndicator={false}
              />
            </View>
            {showSuccessMessage && (
              <Text style={{ color: "green", textAlign: "center" }}>
                Profile updated successfully
              </Text>
            )}
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ marginTop: 20 }}
              />
            ) : hasChanges() ? (
              <SubmitButton
                title={"Share with Langs"}
                disabled={!formState.formIsValid || showSuccessMessage}
                onPress={saveHandler}
                style={{
                  marginTop: "7%",
                  borderRadius: 10,
                  width: "95%",
                  marginLeft: 3,
                  borderBottomEndRadius: 0,
                }}
                color={colors.orange}
              />
            ) : (
              <Text
                style={{
                  color: colors.grey,
                  textAlign: "right",
                  paddingRight: 10,
                  marginTop: Platform.isPad ? "30%" : "30%",
                  marginRight: Platform.isPad ? "8%" : "0%",
                  fontSize: Platform.isPad ? 30 : 20,
                }}
              >
                {userData.hidden ? "Hidden" : "Giddy!"}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    paddingRight: 5,
    // position: "absolute",
  },
  image: {
    margin: 10,
    maxWidth: "80%",
    maxheight: "80%",
    // width: 170,
    // height: 155,
    width: Platform.isPad ? 365 : 170,
    height: Platform.isPad ? 325 : 155,
    borderRadius: Platform.isPad ? 350 / 1 : 125 / 1,

    overflow: "hidden",
  },
  fullNameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
  },
  fullNameText: {
    marginTop: 45,
    // fontSize: 20,
    fontSize: Platform.isPad ? 35 : 20,
    fontWeight: "300",
    Color: "gray",
    fontFamily: "bold",
    overflow: "hidden",
  },

  infoContainer: {
    // marginTop: -40,
    marginTop: Platform.isPad ? 0 : -40,
    padding: 10,
    marginLeft: "3.5%",
  },
  interests: {
    padding: 10,
    marginLeft: 15,
  },
  text: {
    // fontSize: 20,
    fontSize: Platform.isPad ? 30 : 20,
    fontWeight: "400",
    Color: "gray",
    fontFamily: "regular",
  },
  infoText: {
    padding: 1,
    paddingTop: 10,
    marginLeft: -2,
    color: "gray",
    fontFamily: "medium",
    fontSize: Platform.isPad ? 24 : 14,
  },
  infoTextFlag: {
    padding: 1,
    paddingTop: 10,
    marginLeft: 2,
    color: "gray",
    fontFamily: "medium",
    fontSize: Platform.isPad ? 20 : 14,
  },
  iconsTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  settingButtonContainer: {
    marginTop: 19,
    marginLeft: "82%",
    position: "absolute",
    borderColor: "white",
  },

  relationshipContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  infoTextR: {
    padding: 1,
    paddingTop: 0,
    margin: 2,
    color: "gray",
    fontFamily: "medium",
    marginLeft: 5,
    fontSize: Platform.isPad ? 26 : 14,
  },
  statusContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  languageText: {
    padding: 1,
    paddingTop: 10,
    fontFamily: "medium",
    margin: 2,
    color: "gray",
    marginLeft: 25,
    fontSize: Platform.isPad ? 26 : 14,
  },
  languageTextTwo: {
    padding: 1,
    paddingTop: 10,
    fontFamily: "medium",
    margin: 2,
    color: colors.defaultTextColor,
    marginLeft: 45,
    // fontSize: 20,
    fontSize: Platform.isPad ? 30 : 20,
  },
  langContain: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
  },
  langContainTwo: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
  },

  level: {
    flexDirection: "row",
    marginTop: 0,
    alignItems: "center",
  },
  levelContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  textLevel: {
    padding: 1,
    paddingTop: 10,
    fontFamily: "medium",
    margin: 2,
    color: "gray",
    marginLeft: 5,
  },
  listcontainer: {
    // marginTop: "100%",
    padding: 10,
    marginLeft: 2,
    marginTop: "10%",
    // elevation: 5,
  },
  lang: {
    marginTop: "60%",
    padding: 10,
    marginLeft: 2,
    position: "absolute",
  },

  homeContainer: {
    marginLeft: Platform.isPad ? 20 : 20,
  },
  immersion: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    color: colors.defaultTextColor,
    fontSize: 20,
    fontFamily: "medium",
  },
  textLearn: {
    padding: 0,
    paddingTop: 10,
    fontFamily: "bold",
    margin: 2,
    color: colors.orange,

    fontSize: Platform.isPad ? 30 : 20,
    marginLeft: 5,
  },

  att: {
    padding: 0,
    paddingTop: 10,
    fontFamily: "bold",
    margin: 2,
    color: colors.orange,
    fontSize: 20,
    marginLeft: 5,
  },
  at: {
    padding: 0,
    paddingTop: 10,
    margin: 2,
    fontSize: 20,
  },
  location: {
    padding: 2.6,
    paddingTop: 10,
    fontSize: Platform.isPad ? 30 : 20,
    fontFamily: "medium",
    margin: 2,
    color: colors.defaultTextColor,
    fontSize: 20,
    marginLeft: 5,
  },

  infoTextTwo: {
    padding: 1,
    paddingTop: 20,
    margin: 2,
    color: "gray",
    fontFamily: "medium",
    marginLeft: 8,
  },
  LogoNew: {
    width: 100,
    height: 100,
    borderRadius: 100 / 1,
    borderColor: "black",
    marginLeft: 250,
    marginTop: 20,
    resizeMode: "contain",
  },
  locationBC: {
    flexDirection: "row",
    marginTop: 50,
    marginLeft: 4,
    alignItems: "center",
  },
  imageContain: {
    flexDirection: "row",
    justifyContent: "center",
    // position: "absolute",
  },
});
