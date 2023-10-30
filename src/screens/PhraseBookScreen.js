import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import FlashCard from "../../components/FlashCard";
import React, { useEffect, useCallback } from "react";
import PageTitle from "../../components/PageTitle";
import PageContainer from "../../components/PageContainer";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { translateText, translateTextNonRoman } from "../../utils/translation";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-native-uuid";
import { createPhraseCard } from "../../utils/actions/phraseActions";
import Logo from "../../assets/images/TapStart.png";
import SortLang from "../../assets/images/sortLang.png";
import Purchases from "react-native-purchases";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import mobileAds, {
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedInterstitialAd,
} from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-7278635770152409/6836943220";

const PhraseBookScreen = (props) => {
  const [locale, setLocale] = React.useState(Localization.locale);
  const i18n = new I18n({
    "en-US": {
      "Enter a phrase here": "Enter a phrase here",
      Flashcards: "Flashcards",
    },
    "en-MX": {
      "Tap here to create a flashcart": "Toque aquí para traducir",
      Flashcards: "Flashcards",
    },
    "es-MX": {
      "Enter a phrase here": "Toque aquí para traducir",
      Flashcards: "Flashcards",
    },
    "ja-JP": {
      "Enter a phrase here": "ここをタップして翻訳",
      Flashcards: "フラッシュカード",
    },
    "en-JP": {
      "Enter a phrase here": "ここをタップして翻訳",
      Flashcards: "フラッシュカード",
    },
    "zh-CN": {
      "Enter a phrase here": "点击此处进行翻译",
      Flashcards: "闪卡",
    },
    "en-CN": {
      "Enter a phrase here": "点击此处进行翻译",
      Flashcards: "闪卡",
    },
    "zh-TW": {
      "Enter a phrase here": "點擊此處進行翻譯",
      Flashcards: "閃卡",
    },
  });
  i18n.defaultLocale = "en-US";
  console.log("i18n.defaultLocale", i18n.defaultLocale);
  i18n.locale = locale;
  console.log("i18n.locale", i18n.locale);
  i18n.enableFallback = true;
  console.log("i18n.fallbacks", i18n.enableFallback);

  const dispatch = useDispatch();
  const history = useSelector((state) => state.history.history);
  const userData = useSelector((state) => state.auth.userData);
  console.log("userData", userData);
  const [paywallShown, setPaywallShown] = React.useState(false);

  // this allows for # of cards to be shown for each language category.  This is the default
  const [currentCategory, setCurrentCategory] = React.useState("");

  const params = props.route.params || {};
  // clears params after being shown language

  // TODO revove if you want it to show language  and  # of cards
  useEffect(() => {
    setCurrentCategory(params.title);
  }, [params.title]);

  if (params.title) {
    setTimeout(() => {
      params.title = "";
      setCurrentCategory("");
    }, 1000);
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const [swap, setSwap] = React.useState(false);
  const [enteredText, setEnteredText] = React.useState("");
  const [resultText, setResultText] = React.useState("");
  const [collapse, setCollapse] = React.useState(false);
  const [hide, setHide] = React.useState(false);
  // state for language to and from in phrasebook default is english to spanish
  const [languageTo, setLanguageTo] = React.useState(
    userData.language || userData.languageTwo || "es"
  );
  const [languageFrom, setLanguageFrom] = React.useState(
    userData.languageFrom || userData.language || "en"
  );
  const [activeSubscriptions, setActiveSubscriptions] = React.useState([]);
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        // access latest customerInfo to see if they have an active subscription
        const { activeSubscriptions } = customerInfo;

        setActiveSubscriptions(activeSubscriptions);
      } catch (e) {
        // Error fetching customer info
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    if (params.cards) {
      setEnteredText(params.cards.text);
      setLanguageFrom(params.cards.from);
      setLanguageTo(params.cards.to);
    }
  }, [params.cards]);

  const hideInfoImageNoLangs = () => {
    //toggle hide
    setHide(!hide);
  };
  // TODO: fix reward point stuff

  // allows to show the language selected
  useEffect(() => {
    if (params.languageTo) {
      setLanguageTo(params.languageTo);
    }
    if (params.languageFrom) {
      setLanguageFrom(params.languageFrom);
    }
  }, [params.languageTo, params.languageFrom, dispatch]);

  // const onSubmit = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     const result = await translateText(enteredText, languageFrom, languageTo);
  //     console.log("result", result);
  //     if (!result) {
  //       setResultText("No result found");
  //       return;
  //     }
  //     //TODO: made a change here for transliteration
  //     const textResult = result;
  //     setResultText(textResult);
  //     const userId = userData.userId;
  //     const mresult = {
  //       id: uuid.v4(),
  //       from: languageFrom,
  //       to: languageTo,
  //       text: enteredText,
  //       translation: textResult,
  //       users: [userId],
  //     };

  //     createPhraseCard(userId, {
  //       ...mresult,
  //     });
  //     setEnteredText("");
  //     setCurrentCategory("All");
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   Keyboard.dismiss();
  // }, [enteredText, languageTo, languageFrom, dispatch]);
  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      if (userData.romanized) {
        const result = await translateText(
          enteredText,
          languageFrom,
          languageTo
        );
        console.log("result", result);
        if (!result) {
          setResultText("No result found");
          return;
        }
        // TODO: made a change here for transliteration
        const textResult = result;
        setResultText(textResult);
        const userId = userData.userId;
        const mresult = {
          id: uuid.v4(),
          from: languageFrom,
          to: languageTo,
          text: enteredText,
          translation: textResult,
          users: [userId],
        };

        createPhraseCard(userId, {
          ...mresult,
        });
      } else {
        const result = await translateTextNonRoman(
          enteredText,
          languageFrom,
          languageTo
        );
        console.log("result", result);
        if (!result) {
          setResultText("No result found");
          return;
        }
        const textResult =
          result?.translated_text?.[languageTo] || "Translation unavailable";
        setResultText(textResult);
        const userId = userData.userId;
        const mresult = {
          id: uuid.v4(),
          from: languageFrom,
          to: languageTo,
          text: enteredText,
          translation: textResult,
          users: [userId],
        };

        createPhraseCard(userId, {
          ...mresult,
        });
      }

      setEnteredText("");
      setCurrentCategory("All");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    Keyboard.dismiss();
  }, [enteredText, languageTo, languageFrom, userData, dispatch]);

  const swapIt = () => {
    const temp = languageTo;
    setLanguageTo(languageFrom);
    setLanguageFrom(temp);
  };

  const toggleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <PageContainer>
      <View style={styles.buttonContainerAll}>
        <PageTitle title={i18n.t("Flashcards")} />
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onLongPress={() => Alert.alert("collapse / expand")}
          onPress={toggleCollapse}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            padding: 10,
            zIndex: 100,
          }}
        >
          {!collapse ? (
            <MaterialCommunityIcons
              name="arrow-collapse-vertical"
              size={20}
              color={colors.orange}
            />
          ) : (
            <MaterialCommunityIcons
              name="arrow-expand-vertical"
              size={18}
              color={colors.orange}
            />
          )}
        </TouchableOpacity>
      </View>
      {!collapse && (
        <View style={styles.languageContainer}>
          {!swap ? (
            <TouchableOpacity
              style={styles.languageOptions}
              onLongPress={() =>
                Alert.alert("Select a language to translate from")
              }
              onPress={() =>
                props.navigation.navigate("languagePF", {
                  title: "Translate From",
                  selected: languageFrom,
                  mode: "from",
                })
              }
            >
              <Text style={styles.text}>
                {(languageFrom === "af" && "Afrikaans") ||
                  (languageFrom === "ar" && "Arabic") ||
                  (languageFrom === "sq" && "Albanian") ||
                  (languageFrom === "am" && "Amharic") ||
                  (languageFrom === "hy" && "Armenian") ||
                  (languageFrom === "az" && "Azerbaijani") ||
                  (languageFrom === "eu" && "Basque") ||
                  (languageFrom === "be" && "Belarusian") ||
                  (languageFrom === "bn" && "Bengali") ||
                  (languageFrom === "bs" && "Bosnian") ||
                  (languageFrom === "bg" && "Bulgarian") ||
                  (languageFrom === "ca" && "Catalan") ||
                  (languageFrom === "ceb" && "Cebuano") ||
                  (languageFrom === "ny" && "Chichewa") ||
                  (languageFrom === "zh-CN" && "Chinese") ||
                  (languageFrom === "zh-TW" && "Chinese") ||
                  (languageFrom === "co" && "Corsican") ||
                  (languageFrom === "hr" && "Croatian") ||
                  (languageFrom === "cs" && "Czech") ||
                  (languageFrom === "da" && "Danish") ||
                  (languageFrom === "nl" && "Dutch") ||
                  (languageFrom === "en" && "English") ||
                  (languageFrom === "eo" && "Esperanto") ||
                  (languageFrom === "et" && "Estonian") ||
                  (languageFrom === "tl" && "Filipino") ||
                  (languageFrom === "fi" && "Finnish") ||
                  (languageFrom === "fr" && "French") ||
                  (languageFrom === "fy" && "Frisian") ||
                  (languageFrom === "gl" && "Galician") ||
                  (languageFrom === "ka" && "Georgian") ||
                  (languageFrom === "de" && "German") ||
                  (languageFrom === "el" && "Greek") ||
                  (languageFrom === "gu" && "Gujarati") ||
                  (languageFrom === "ht" && "Haitian Creole") ||
                  (languageFrom === "ha" && "Hausa") ||
                  (languageFrom === "haw" && "Hawaiian") ||
                  (languageFrom === "iw" && "Hebrew") ||
                  (languageFrom === "hi" && "Hindi") ||
                  (languageFrom === "hmn" && "Hmong") ||
                  (languageFrom === "hu" && "Hungarian") ||
                  (languageFrom === "is" && "Icelandic") ||
                  (languageFrom === "ig" && "Igbo") ||
                  (languageFrom === "id" && "Indonesian") ||
                  (languageFrom === "ga" && "Irish") ||
                  (languageFrom === "it" && "Italian") ||
                  (languageFrom === "ja" && "Japanese") ||
                  (languageFrom === "jw" && "Javanese") ||
                  (languageFrom === "kn" && "Kannada") ||
                  (languageFrom === "kk" && "Kazakh") ||
                  (languageFrom === "km" && "Khmer") ||
                  (languageFrom === "ko" && "Korean") ||
                  (languageFrom === "ku" && "Kurdish (Kurmanji)") ||
                  (languageFrom === "ky" && "Kyrgyz") ||
                  (languageFrom === "lo" && "Lao") ||
                  (languageFrom === "la" && "Latin") ||
                  (languageFrom === "lv" && "Latvian") ||
                  (languageFrom === "lt" && "Lithuanian") ||
                  (languageFrom === "lb" && "Luxembourgish") ||
                  (languageFrom === "mk" && "Macedonian") ||
                  (languageFrom === "mg" && "Malagasy") ||
                  (languageFrom === "ms" && "Malay") ||
                  (languageFrom === "ml" && "Malayalam") ||
                  (languageFrom === "mt" && "Maltese") ||
                  (languageFrom === "mi" && "Maori") ||
                  (languageFrom === "mr" && "Marathi") ||
                  (languageFrom === "mn" && "Mongolian") ||
                  (languageFrom === "my" && "Myanmar (Burmese)") ||
                  (languageFrom === "ne" && "Nepali") ||
                  (languageFrom === "no" && "Norwegian") ||
                  (languageFrom === "ny" && "Nyanja (Chichewa)") ||
                  (languageFrom === "ps" && "Pashto") ||
                  (languageFrom === "fa" && "Persian") ||
                  (languageFrom === "pl" && "Polish") ||
                  (languageFrom === "pt" && "Portuguese") ||
                  (languageFrom === "pa" && "Punjabi") ||
                  (languageFrom === "ro" && "Romanian") ||
                  (languageFrom === "ru" && "Russian") ||
                  (languageFrom === "sm" && "Samoan") ||
                  (languageFrom === "gd" && "Scots Gaelic") ||
                  (languageFrom === "sr" && "Serbian") ||
                  (languageFrom === "st" && "Sesotho") ||
                  (languageFrom === "sn" && "Shona") ||
                  (languageFrom === "sd" && "Sindhi") ||
                  (languageFrom === "si" && "Sinhala") ||
                  (languageFrom === "sk" && "Slovak") ||
                  (languageFrom === "sl" && "Slovenian") ||
                  (languageFrom === "so" && "Somali") ||
                  (languageFrom === "es" && "Spanish") ||
                  (languageFrom === "su" && "Sundanese") ||
                  (languageFrom === "sw" && "Swahili") ||
                  (languageFrom === "sv" && "Swedish") ||
                  (languageFrom === "tg" && "Tajik") ||
                  (languageFrom === "ta" && "Tamil") ||
                  (languageFrom === "te" && "Telugu") ||
                  (languageFrom === "th" && "Thai") ||
                  (languageFrom === "tr" && "Turkish") ||
                  (languageFrom === "uk" && "Ukrainian") ||
                  (languageFrom === "ur" && "Urdu") ||
                  (languageFrom === "uz" && "Uzbek") ||
                  (languageFrom === "vi" && "Vietnamese") ||
                  (languageFrom === "cy" && "Welsh") ||
                  (languageFrom === "xh" && "Xhosa") ||
                  (languageFrom === "yi" && "Yiddish") ||
                  (languageFrom === "yo" && "Yoruba") ||
                  (languageFrom === "zu" && "Zulu")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.languageOptions}
              onLongPress={() =>
                Alert.alert("Select a language to translate to")
              }
              onPress={() =>
                props.navigation.navigate("languageSelect", {
                  title: "translate to",
                  selected: languageTo,
                  mode: "to",
                })
              }
            >
              <Text style={styles.text}>
                {(languageTo === "af" && "Afrikaans") ||
                  (languageTo === "ar" && "Arabic") ||
                  (languageTo === "sq" && "Albanian") ||
                  (languageTo === "am" && "Amharic") ||
                  (languageTo === "hy" && "Armenian") ||
                  (languageTo === "az" && "Azerbaijani") ||
                  (languageTo === "eu" && "Basque") ||
                  (languageTo === "be" && "Belarusian") ||
                  (languageTo === "bn" && "Bengali") ||
                  (languageTo === "bs" && "Bosnian") ||
                  (languageTo === "bg" && "Bulgarian") ||
                  (languageTo === "ca" && "Catalan") ||
                  (languageTo === "ceb" && "Cebuano") ||
                  (languageTo === "ny" && "Chichewa") ||
                  (languageTo === "zh-CN" && "Chinese") ||
                  (languageTo === "zh-TW" && "Chinese") ||
                  (languageTo === "co" && "Corsican") ||
                  (languageTo === "hr" && "Croatian") ||
                  (languageTo === "cs" && "Czech") ||
                  (languageTo === "da" && "Danish") ||
                  (languageTo === "nl" && "Dutch") ||
                  (languageTo === "en" && "English") ||
                  (languageTo === "eo" && "Esperanto") ||
                  (languageTo === "et" && "Estonian") ||
                  (languageTo === "tl" && "Filipino") ||
                  (languageTo === "fi" && "Finnish") ||
                  (languageTo === "fr" && "French") ||
                  (languageTo === "fy" && "Frisian") ||
                  (languageTo === "gl" && "Galician") ||
                  (languageTo === "ka" && "Georgian") ||
                  (languageTo === "de" && "German") ||
                  (languageTo === "el" && "Greek") ||
                  (languageTo === "gu" && "Gujarati") ||
                  (languageTo === "ht" && "Haitian Creole") ||
                  (languageTo === "ha" && "Hausa") ||
                  (languageTo === "haw" && "Hawaiian") ||
                  (languageTo === "iw" && "Hebrew") ||
                  (languageTo === "hi" && "Hindi") ||
                  (languageTo === "hmn" && "Hmong") ||
                  (languageTo === "hu" && "Hungarian") ||
                  (languageTo === "is" && "Icelandic") ||
                  (languageTo === "ig" && "Igbo") ||
                  (languageTo === "id" && "Indonesian") ||
                  (languageTo === "ga" && "Irish") ||
                  (languageTo === "it" && "Italian") ||
                  (languageTo === "ja" && "Japanese") ||
                  (languageTo === "jw" && "Javanese") ||
                  (languageTo === "kn" && "Kannada") ||
                  (languageTo === "kk" && "Kazakh") ||
                  (languageTo === "km" && "Khmer") ||
                  (languageTo === "ko" && "Korean") ||
                  (languageTo === "ku" && "Kurdish (Kurmanji)") ||
                  (languageTo === "ky" && "Kyrgyz") ||
                  (languageTo === "lo" && "Lao") ||
                  (languageTo === "la" && "Latin") ||
                  (languageTo === "lv" && "Latvian") ||
                  (languageTo === "lt" && "Lithuanian") ||
                  (languageTo === "lb" && "Luxembourgish") ||
                  (languageTo === "mk" && "Macedonian") ||
                  (languageTo === "mg" && "Malagasy") ||
                  (languageTo === "ms" && "Malay") ||
                  (languageTo === "ml" && "Malayalam") ||
                  (languageTo === "mt" && "Maltese") ||
                  (languageTo === "mi" && "Maori") ||
                  (languageTo === "mr" && "Marathi") ||
                  (languageTo === "mn" && "Mongolian") ||
                  (languageTo === "my" && "Myanmar (Burmese)") ||
                  (languageTo === "ne" && "Nepali") ||
                  (languageTo === "no" && "Norwegian") ||
                  (languageTo === "ny" && "Nyanja (Chichewa)") ||
                  (languageTo === "ps" && "Pashto") ||
                  (languageTo === "fa" && "Persian") ||
                  (languageTo === "pl" && "Polish") ||
                  (languageTo === "pt" && "Portuguese") ||
                  (languageTo === "pa" && "Punjabi") ||
                  (languageTo === "ro" && "Romanian") ||
                  (languageTo === "ru" && "Russian") ||
                  (languageTo === "sm" && "Samoan") ||
                  (languageTo === "gd" && "Scots Gaelic") ||
                  (languageTo === "sr" && "Serbian") ||
                  (languageTo === "st" && "Sesotho") ||
                  (languageTo === "sn" && "Shona") ||
                  (languageTo === "sd" && "Sindhi") ||
                  (languageTo === "si" && "Sinhala") ||
                  (languageTo === "sk" && "Slovak") ||
                  (languageTo === "sl" && "Slovenian") ||
                  (languageTo === "so" && "Somali") ||
                  (languageTo === "es" && "Spanish") ||
                  (languageTo === "su" && "Sundanese") ||
                  (languageTo === "sw" && "Swahili") ||
                  (languageTo === "sv" && "Swedish") ||
                  (languageTo === "tg" && "Tajik") ||
                  (languageTo === "ta" && "Tamil") ||
                  (languageTo === "te" && "Telugu") ||
                  (languageTo === "th" && "Thai") ||
                  (languageTo === "tr" && "Turkish") ||
                  (languageTo === "uk" && "Ukrainian") ||
                  (languageTo === "ur" && "Urdu") ||
                  (languageTo === "uz" && "Uzbek") ||
                  (languageTo === "vi" && "Vietnamese") ||
                  (languageTo === "cy" && "Welsh") ||
                  (languageTo === "xh" && "Xhosa") ||
                  (languageTo === "yi" && "Yiddish") ||
                  (languageTo === "yo" && "Yoruba") ||
                  (languageTo === "zu" && "Zulu")}
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.arrowContainer}>
            <TouchableOpacity
              onPress={swapIt}
              onLongPress={() => Alert.alert("Swap languages")}
            >
              <MaterialIcons
                name="compare-arrows"
                size={24}
                color={colors.burntSienna}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>

          {swap ? (
            <TouchableOpacity
              style={styles.languageOptions}
              onLongPress={() =>
                Alert.alert("Select a language to translate from")
              }
              onPress={() =>
                props.navigation.navigate("languageSelect", {
                  title: "translate from",
                  selected: languageFrom,
                  mode: "from",
                })
              }
            >
              <Text style={styles.text}>
                {(languageFrom === "af" && "Afrikaans") ||
                  (languageFrom === "ar" && "Arabic") ||
                  (languageFrom === "sq" && "Albanian") ||
                  (languageFrom === "am" && "Amharic") ||
                  (languageFrom === "hy" && "Armenian") ||
                  (languageFrom === "az" && "Azerbaijani") ||
                  (languageFrom === "eu" && "Basque") ||
                  (languageFrom === "be" && "Belarusian") ||
                  (languageFrom === "bn" && "Bengali") ||
                  (languageFrom === "bs" && "Bosnian") ||
                  (languageFrom === "bg" && "Bulgarian") ||
                  (languageFrom === "ca" && "Catalan") ||
                  (languageFrom === "ceb" && "Cebuano") ||
                  (languageFrom === "ny" && "Chichewa") ||
                  (languageFrom === "zh-CN" && "Chinese") ||
                  (languageFrom === "zh-TW" && "Chinese") ||
                  (languageFrom === "co" && "Corsican") ||
                  (languageFrom === "hr" && "Croatian") ||
                  (languageFrom === "cs" && "Czech") ||
                  (languageFrom === "da" && "Danish") ||
                  (languageFrom === "nl" && "Dutch") ||
                  (languageFrom === "en" && "English") ||
                  (languageFrom === "eo" && "Esperanto") ||
                  (languageFrom === "et" && "Estonian") ||
                  (languageFrom === "tl" && "Filipino") ||
                  (languageFrom === "fi" && "Finnish") ||
                  (languageFrom === "fr" && "French") ||
                  (languageFrom === "fy" && "Frisian") ||
                  (languageFrom === "gl" && "Galician") ||
                  (languageFrom === "ka" && "Georgian") ||
                  (languageFrom === "de" && "German") ||
                  (languageFrom === "el" && "Greek") ||
                  (languageFrom === "gu" && "Gujarati") ||
                  (languageFrom === "ht" && "Haitian Creole") ||
                  (languageFrom === "ha" && "Hausa") ||
                  (languageFrom === "haw" && "Hawaiian") ||
                  (languageFrom === "iw" && "Hebrew") ||
                  (languageFrom === "hi" && "Hindi") ||
                  (languageFrom === "hmn" && "Hmong") ||
                  (languageFrom === "hu" && "Hungarian") ||
                  (languageFrom === "is" && "Icelandic") ||
                  (languageFrom === "ig" && "Igbo") ||
                  (languageFrom === "id" && "Indonesian") ||
                  (languageFrom === "ga" && "Irish") ||
                  (languageFrom === "it" && "Italian") ||
                  (languageFrom === "ja" && "Japanese") ||
                  (languageFrom === "jw" && "Javanese") ||
                  (languageFrom === "kn" && "Kannada") ||
                  (languageFrom === "kk" && "Kazakh") ||
                  (languageFrom === "km" && "Khmer") ||
                  (languageFrom === "ko" && "Korean") ||
                  (languageFrom === "ku" && "Kurdish (Kurmanji)") ||
                  (languageFrom === "ky" && "Kyrgyz") ||
                  (languageFrom === "lo" && "Lao") ||
                  (languageFrom === "la" && "Latin") ||
                  (languageFrom === "lv" && "Latvian") ||
                  (languageFrom === "lt" && "Lithuanian") ||
                  (languageFrom === "lb" && "Luxembourgish") ||
                  (languageFrom === "mk" && "Macedonian") ||
                  (languageFrom === "mg" && "Malagasy") ||
                  (languageFrom === "ms" && "Malay") ||
                  (languageFrom === "ml" && "Malayalam") ||
                  (languageFrom === "mt" && "Maltese") ||
                  (languageFrom === "mi" && "Maori") ||
                  (languageFrom === "mr" && "Marathi") ||
                  (languageFrom === "mn" && "Mongolian") ||
                  (languageFrom === "my" && "Myanmar (Burmese)") ||
                  (languageFrom === "ne" && "Nepali") ||
                  (languageFrom === "no" && "Norwegian") ||
                  (languageFrom === "ny" && "Nyanja (Chichewa)") ||
                  (languageFrom === "ps" && "Pashto") ||
                  (languageFrom === "fa" && "Persian") ||
                  (languageFrom === "pl" && "Polish") ||
                  (languageFrom === "pt" && "Portuguese") ||
                  (languageFrom === "pa" && "Punjabi") ||
                  (languageFrom === "ro" && "Romanian") ||
                  (languageFrom === "ru" && "Russian") ||
                  (languageFrom === "sm" && "Samoan") ||
                  (languageFrom === "gd" && "Scots Gaelic") ||
                  (languageFrom === "sr" && "Serbian") ||
                  (languageFrom === "st" && "Sesotho") ||
                  (languageFrom === "sn" && "Shona") ||
                  (languageFrom === "sd" && "Sindhi") ||
                  (languageFrom === "si" && "Sinhala") ||
                  (languageFrom === "sk" && "Slovak") ||
                  (languageFrom === "sl" && "Slovenian") ||
                  (languageFrom === "so" && "Somali") ||
                  (languageFrom === "es" && "Spanish") ||
                  (languageFrom === "su" && "Sundanese") ||
                  (languageFrom === "sw" && "Swahili") ||
                  (languageFrom === "sv" && "Swedish") ||
                  (languageFrom === "tg" && "Tajik") ||
                  (languageFrom === "ta" && "Tamil") ||
                  (languageFrom === "te" && "Telugu") ||
                  (languageFrom === "th" && "Thai") ||
                  (languageFrom === "tr" && "Turkish") ||
                  (languageFrom === "uk" && "Ukrainian") ||
                  (languageFrom === "ur" && "Urdu") ||
                  (languageFrom === "uz" && "Uzbek") ||
                  (languageFrom === "vi" && "Vietnamese") ||
                  (languageFrom === "cy" && "Welsh") ||
                  (languageFrom === "xh" && "Xhosa") ||
                  (languageFrom === "yi" && "Yiddish") ||
                  (languageFrom === "yo" && "Yoruba") ||
                  (languageFrom === "zu" && "Zulu")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.languageOptions}
              onLongPress={() =>
                Alert.alert("Select a language to translate to")
              }
              onPress={() =>
                props.navigation.navigate("languageSelect", {
                  title: "translate to",
                  selected: languageTo,
                  mode: "to",
                })
              }
            >
              <Text style={styles.text}>
                {(languageTo === "af" && "Afrikaans") ||
                  (languageTo === "ar" && "Arabic") ||
                  (languageTo === "sq" && "Albanian") ||
                  (languageTo === "am" && "Amharic") ||
                  (languageTo === "hy" && "Armenian") ||
                  (languageTo === "az" && "Azerbaijani") ||
                  (languageTo === "eu" && "Basque") ||
                  (languageTo === "be" && "Belarusian") ||
                  (languageTo === "bn" && "Bengali") ||
                  (languageTo === "bs" && "Bosnian") ||
                  (languageTo === "bg" && "Bulgarian") ||
                  (languageTo === "ca" && "Catalan") ||
                  (languageTo === "ceb" && "Cebuano") ||
                  (languageTo === "ny" && "Chichewa") ||
                  (languageTo === "zh-CN" && "Chinese") ||
                  (languageTo === "zh-TW" && "Chinese") ||
                  (languageTo === "co" && "Corsican") ||
                  (languageTo === "hr" && "Croatian") ||
                  (languageTo === "cs" && "Czech") ||
                  (languageTo === "da" && "Danish") ||
                  (languageTo === "nl" && "Dutch") ||
                  (languageTo === "en" && "English") ||
                  (languageTo === "eo" && "Esperanto") ||
                  (languageTo === "et" && "Estonian") ||
                  (languageTo === "tl" && "Filipino") ||
                  (languageTo === "fi" && "Finnish") ||
                  (languageTo === "fr" && "French") ||
                  (languageTo === "fy" && "Frisian") ||
                  (languageTo === "gl" && "Galician") ||
                  (languageTo === "ka" && "Georgian") ||
                  (languageTo === "de" && "German") ||
                  (languageTo === "el" && "Greek") ||
                  (languageTo === "gu" && "Gujarati") ||
                  (languageTo === "ht" && "Haitian Creole") ||
                  (languageTo === "ha" && "Hausa") ||
                  (languageTo === "haw" && "Hawaiian") ||
                  (languageTo === "iw" && "Hebrew") ||
                  (languageTo === "hi" && "Hindi") ||
                  (languageTo === "hmn" && "Hmong") ||
                  (languageTo === "hu" && "Hungarian") ||
                  (languageTo === "is" && "Icelandic") ||
                  (languageTo === "ig" && "Igbo") ||
                  (languageTo === "id" && "Indonesian") ||
                  (languageTo === "ga" && "Irish") ||
                  (languageTo === "it" && "Italian") ||
                  (languageTo === "ja" && "Japanese") ||
                  (languageTo === "jw" && "Javanese") ||
                  (languageTo === "kn" && "Kannada") ||
                  (languageTo === "kk" && "Kazakh") ||
                  (languageTo === "km" && "Khmer") ||
                  (languageTo === "ko" && "Korean") ||
                  (languageTo === "ku" && "Kurdish (Kurmanji)") ||
                  (languageTo === "ky" && "Kyrgyz") ||
                  (languageTo === "lo" && "Lao") ||
                  (languageTo === "la" && "Latin") ||
                  (languageTo === "lv" && "Latvian") ||
                  (languageTo === "lt" && "Lithuanian") ||
                  (languageTo === "lb" && "Luxembourgish") ||
                  (languageTo === "mk" && "Macedonian") ||
                  (languageTo === "mg" && "Malagasy") ||
                  (languageTo === "ms" && "Malay") ||
                  (languageTo === "ml" && "Malayalam") ||
                  (languageTo === "mt" && "Maltese") ||
                  (languageTo === "mi" && "Maori") ||
                  (languageTo === "mr" && "Marathi") ||
                  (languageTo === "mn" && "Mongolian") ||
                  (languageTo === "my" && "Myanmar (Burmese)") ||
                  (languageTo === "ne" && "Nepali") ||
                  (languageTo === "no" && "Norwegian") ||
                  (languageTo === "ny" && "Nyanja (Chichewa)") ||
                  (languageTo === "ps" && "Pashto") ||
                  (languageTo === "fa" && "Persian") ||
                  (languageTo === "pl" && "Polish") ||
                  (languageTo === "pt" && "Portuguese") ||
                  (languageTo === "pa" && "Punjabi") ||
                  (languageTo === "ro" && "Romanian") ||
                  (languageTo === "ru" && "Russian") ||
                  (languageTo === "sm" && "Samoan") ||
                  (languageTo === "gd" && "Scots Gaelic") ||
                  (languageTo === "sr" && "Serbian") ||
                  (languageTo === "st" && "Sesotho") ||
                  (languageTo === "sn" && "Shona") ||
                  (languageTo === "sd" && "Sindhi") ||
                  (languageTo === "si" && "Sinhala") ||
                  (languageTo === "sk" && "Slovak") ||
                  (languageTo === "sl" && "Slovenian") ||
                  (languageTo === "so" && "Somali") ||
                  (languageTo === "es" && "Spanish") ||
                  (languageTo === "su" && "Sundanese") ||
                  (languageTo === "sw" && "Swahili") ||
                  (languageTo === "sv" && "Swedish") ||
                  (languageTo === "tg" && "Tajik") ||
                  (languageTo === "ta" && "Tamil") ||
                  (languageTo === "te" && "Telugu") ||
                  (languageTo === "th" && "Thai") ||
                  (languageTo === "tr" && "Turkish") ||
                  (languageTo === "uk" && "Ukrainian") ||
                  (languageTo === "ur" && "Urdu") ||
                  (languageTo === "uz" && "Uzbek") ||
                  (languageTo === "vi" && "Vietnamese") ||
                  (languageTo === "cy" && "Welsh") ||
                  (languageTo === "xh" && "Xhosa") ||
                  (languageTo === "yi" && "Yiddish") ||
                  (languageTo === "yo" && "Yoruba") ||
                  (languageTo === "zu" && "Zulu")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {!collapse && (
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            blurOnSubmit={true}
            autoCorrect={true}
            autoCapitalize="none"
            autoComplete="off"
            placeholder={i18n.t("Enter a phrase here")}
            style={styles.TextInput}
            onChangeText={(text) => setEnteredText(text)}
            keyboardType="default"
            value={enteredText ? enteredText : Keyboard.dismiss()}
          />

          <TouchableOpacity
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            onLongPress={() => Alert.alert("Add a flashcard")}
            onPress={onSubmit}
            disabled={
              isLoading || enteredText === ""
              // activeSubscriptions.length === 0
            }
          >
            {/* disable plus sign if no entered text */}
            {isLoading ? (
              <ActivityIndicator
                style={{ padding: 15 }}
                size="small"
                color={colors.black}
              />
            ) : (
              <MaterialIcons
                name="add"
                size={35}
                color={enteredText !== "" ? colors.burntSienna : colors.orange}
                style={{ padding: 10 }}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.flashCardContainerDivide}>
        <TouchableWithoutFeedback
          onLongPress={() =>
            Alert.alert("How many flaschards in each language category?")
          }
          onPress={() =>
            Alert.alert(
              "Try to guess the meaning of the word or phrase and TAP on the card to see the answer"
            )
          }
        >
          <Text style={styles.flashCardContainerDivideText}>
            {currentCategory === "All" && "All"
              ? "All"
              : history.phrases.length}
            {""}
            {currentCategory === "All" ||
              (currentCategory === "af" && " Afrikaans") ||
              (currentCategory === "ar" && " Arabic") ||
              (currentCategory === "sq" && " Albanian") ||
              (currentCategory === "am" && " Amharic") ||
              (currentCategory === "hy" && " Armenian") ||
              (currentCategory === "az" && " Azerbaijani") ||
              (currentCategory === "eu" && " Basque") ||
              (currentCategory === "be" && " Belarusian") ||
              (currentCategory === "bn" && " Bengali") ||
              (currentCategory === "bs" && " Bosnian") ||
              (currentCategory === "bg" && " Bulgarian") ||
              (currentCategory === "ca" && " Catalan") ||
              (currentCategory === "ceb" && " Cebuano") ||
              (currentCategory === "ny" && " Chichewa") ||
              (currentCategory === "zh-CN" && " Chinese") ||
              (currentCategory === "zh-TW" && " Chinese") ||
              (currentCategory === "co" && " Corsican") ||
              (currentCategory === "hr" && " Croatian") ||
              (currentCategory === "cs" && " Czech") ||
              (currentCategory === "da" && " Danish") ||
              (currentCategory === "nl" && " Dutch") ||
              (currentCategory === "en" && " English") ||
              (currentCategory === "eo" && " Esperanto") ||
              (currentCategory === "et" && " Estonian") ||
              (currentCategory === "tl" && " Filipino") ||
              (currentCategory === "fi" && " Finnish") ||
              (currentCategory === "fr" && " French") ||
              (currentCategory === "fy" && " Frisian") ||
              (currentCategory === "gl" && " Galician") ||
              (currentCategory === "ka" && " Georgian") ||
              (currentCategory === "de" && " German") ||
              (currentCategory === "el" && " Greek") ||
              (currentCategory === "gu" && " Gujarati") ||
              (currentCategory === "ht" && " Haitian Creole") ||
              (currentCategory === "ha" && " Hausa") ||
              (currentCategory === "haw" && " Hawaiian") ||
              (currentCategory === "iw" && " Hebrew") ||
              (currentCategory === "he" && " Hebrew") ||
              (currentCategory === "hi" && " Hindi") ||
              (currentCategory === "hmn" && " Hmong") ||
              (currentCategory === "hu" && " Hungarian") ||
              (currentCategory === "is" && " Icelandic") ||
              (currentCategory === "ig" && " Igbo") ||
              (currentCategory === "id" && " Indonesian") ||
              (currentCategory === "ga" && " Irish") ||
              (currentCategory === "it" && " Italian") ||
              (currentCategory === "ja" && " Japanese") ||
              (currentCategory === "jw" && " Javanese") ||
              (currentCategory === "kn" && " Kannada") ||
              (currentCategory === "kk" && " Kazakh") ||
              (currentCategory === "km" && " Khmer") ||
              (currentCategory === "ko" && " Korean") ||
              (currentCategory === "ku" && " Kurdish (Kurmanji)") ||
              (currentCategory === "ky" && " Kyrgyz") ||
              (currentCategory === "lo" && " Lao") ||
              (currentCategory === "la" && " Latin") ||
              (currentCategory === "lv" && " Latvian") ||
              (currentCategory === "lt" && " Lithuanian") ||
              (currentCategory === "lb" && " Luxembourgish") ||
              (currentCategory === "mk" && " Macedonian") ||
              (currentCategory === "mg" && " Malagasy") ||
              (currentCategory === "ms" && " Malay") ||
              (currentCategory === "ml" && " Malayalam") ||
              (currentCategory === "mt" && " Maltese") ||
              (currentCategory === "mi" && " Maori") ||
              (currentCategory === "mr" && " Marathi") ||
              (currentCategory === "mn" && " Mongolian") ||
              (currentCategory === "my" && " Myanmar (Burmese)") ||
              (currentCategory === "ne" && " Nepali") ||
              (currentCategory === "no" && " Norwegian") ||
              (currentCategory === "ps" && " Pashto") ||
              (currentCategory === "fa" && " Persian") ||
              (currentCategory === "pl" && " Polish") ||
              (currentCategory === "pt" && " Portuguese") ||
              (currentCategory === "ma" && " Punjabi") ||
              (currentCategory === "ro" && " Romanian") ||
              (currentCategory === "ru" && " Russian") ||
              (currentCategory === "sm" && " Samoan") ||
              (currentCategory === "gd" && " Scots Gaelic") ||
              (currentCategory === "sr" && " Serbian") ||
              (currentCategory === "st" && " Sesotho") ||
              (currentCategory === "sn" && " Shona") ||
              (currentCategory === "sd" && " Sindhi") ||
              (currentCategory === "si" && " Sinhala") ||
              (currentCategory === "sk" && " Slovak") ||
              (currentCategory === "sl" && " Slovenian") ||
              (currentCategory === "so" && " Somali") ||
              (currentCategory === "es" && " Spanish") ||
              (currentCategory === "su" && " Sundanese") ||
              (currentCategory === "sw" && " Swahili") ||
              (currentCategory === "sv" && " Swedish") ||
              (currentCategory === "tg" && " Tajik") ||
              (currentCategory === "ta" && " Tamil") ||
              (currentCategory === "te" && " Telugu") ||
              (currentCategory === "th" && " Thai") ||
              (currentCategory === "tr" && " Turkish") ||
              (currentCategory === "uk" && " Ukrainian") ||
              (currentCategory === "ur" && " Urdu") ||
              (currentCategory === "uz" && " Uzbek") ||
              (currentCategory === "vi" && " Vietnamese") ||
              (currentCategory === "cy" && " Welsh") ||
              (currentCategory === "xh" && " Xhosa") ||
              (currentCategory === "yi" && " Yiddish") ||
              (currentCategory === "yo" && " Yoruba") ||
              (currentCategory === "zu" && " Zulu")}{" "}
            {history.phrases.length === 1 ? (
              <Text>Flashcard</Text>
            ) : (
              <Text>Flashcards</Text>
            )}
          </Text>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          style={styles.soundAdjust}
          hitSlop={{ top: 10, bottom: 10, left: 40, right: 40 }}
          onLongPress={() =>
            Alert.alert("Find flashcards by language category")
          }
          onPress={() =>
            props.navigation.navigate("LanguageBox", {
              title: "translate to",
              selected: languageTo,
              mode: "to",
              translation: resultText,
              text: enteredText,
            })
          }
        >
          <Image style={styles.imageButton} source={SortLang} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {history.phrases.length === 0 ? (
          <>
            {/* <TouchableOpacity onPress={hideInfoImageNoLangs}> */}
            <Image style={styles.image} source={Logo} />
            {/* </TouchableOpacity> */}
          </>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={history.phrases.slice().reverse()}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => {
              return <FlashCard item={itemData.item} itemId={itemData} />;
            }}
          />
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 0,
        }}
      >
        {/* {activeSubscriptions.length === 0 && (
          <BannerAd
            // unitId={TestIds.BANNER}
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        )} */}
      </View>
    </PageContainer>
  );
};

export default PhraseBookScreen;
const styles = StyleSheet.create({
  languageOptions: {
    // backgroundColor: colors.primary,
    // padding: -10,
    // borderRadius: 10,
    // margin: 10,
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  arrowIcon: {
    opacity: 0.7,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
  text: {
    color: colors.orange,
    fontSize: Platform.isPad ? 26 : 20,
    textAlign: "center",
    fontFamily: "semiBold",
    // shadowColor: "rgba(0,0,0, .4)",
    // shadowOffset: { height: 0.2, width: 0.2 },
    // // shadowOpacity: 0.5,
    // shadowRadius: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.orange,
    borderColor: colors.orange,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.orange,
    // height: 130,
    height: Platform.isPad ? 260 : 130,
    width: "100%",
    borderBottomStartRadius: 0,
    borderTopEndRadius: 26,
  },
  TextInput: {
    flex: 1,
    fontSize: Platform.isPad ? 26 : 16,
    fontFamily: "regular",
    opacity: 0.8,
    textAlign: "center",
  },
  flashCardContainer: {
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    flex: 1 / 2,
    borderWidth: 1,
    // elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    color: colors.primary,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "regular",
    justifyContent: "center",
  },
  enteredText: {
    color: colors.defaultTextColor,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "regular",
  },
  buttonAddFriend: {
    borderRadius: 10,
    backgroundColor: "black",
    color: "black",
    height: 50,
    width: 200,
    borderWidth: 1,
  },
  buttonContainerAddFriends: {
    borderRadius: 5,
    backgroundColor: "white",
    color: "black",
    height: 30,
    width: 150,
    // borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainerAddFriends: {
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    marginLeft: 110,
    marginBottom: 15,
  },
  buttonTextAddFriends: {
    color: colors.defaultTextColor,
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "bold",
  },
  buttonContainerAll: {
    flexDirection: "row",
    alignItems: "space-between",
    justifyContent: "space-between",
    width: "100%",
  },
  flashCardContainerDivide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    fontFamily: "regular",
    letterSpacing: 1,
  },
  flashCardContainerDivideText: {
    color: colors.defaultTextColor,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "medium",
  },
  image: {
    // marginTop: Platform.isPad ? 100 : 50,
    marginTop: Platform.isPad ? 100 : "13.6%",
    width: 360,
    height: 360,
    marginLeft: 3,
    opacity: 0.8,
    alignSelf: "center",
    resizeMode: "contain",
  },
  soundAdjust: {
    position: "absolute",
    right: 0,
    top: 10,
    marginTop: -8,
  },
  numberCards: {
    color: colors.defaultTextColor,

    fontSize: 10,
    textAlign: "center",
    fontFamily: "regular",
    opacity: 0.5,
  },
  imageButton: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },
});
