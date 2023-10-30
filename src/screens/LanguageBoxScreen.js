import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Touchable,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import supportedLanguages from "../../utils/supportedLanguages";
import LanguageItem from "../../components/LanguageItem";
import { useDispatch, useSelector } from "react-redux";
import {
  getPhraseCardsFromUser,
  getPhraseCardsFromUserByLanguage,
  getPhraseCardsLanguage,
  getPhraseCardsLanguageTwo,
} from "../../utils/actions/phraseActions";
import { setHistoryItem } from "../../store/historySlice";
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={colors.primary}
    />
  );
};

const LanguageBoxScreen = (props) => {
  const dispatch = useDispatch();
  const { navigation, route } = props;
  const params = route.params || {};
  const { title, selected } = params;
  console.log("params", params);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Stored Flashcards",
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              color={colors.primary}
              title="close"
              iconName="ios-close"
              onPress={() => {
                navigation.goBack();
              }}
            />
          </HeaderButtons>
        );
      },
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              color={colors.black}
              title="all"
              iconName="ios-list"
              onPress={allLanguageSelect}
              onLongPress={() => {
                Alert.alert("All Flashcards", "View all flashcards");
              }}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  const onLanguageSelect = useCallback(
    async (itemKey) => {
      const dataKey = params.mode === "to";
      let cards = [];
      cards = await getPhraseCardsFromUserByLanguage(
        userData.userId,
        dataKey,
        itemKey
      );

      dispatch(setHistoryItem({ phrases: cards }));
      navigation.navigate("Flashcards", { title: itemKey });
    },
    [params, navigation]
  );

  const allLanguageSelect = useCallback(
    async (itemKey) => {
      const dataKey = params.mode === "to";
      let cards = [];
      cards = await getPhraseCardsFromUser(userData.userId, dataKey, itemKey);
      const title = "All";
      dispatch(setHistoryItem({ phrases: cards }));
      navigation.navigate("Flashcards", { title });
    },
    [params, navigation]
  );
  // get language 1 flascards quickly
  const getPhraseCardsByLanguage = useCallback(
    async (itemKey) => {
      const dataKey = params.mode === "to";
      let cards = [];
      cards = await getPhraseCardsLanguage(
        userData.userId,
        userData.language,
        dataKey,
        itemKey
      );
      const title = userData.language;
      dispatch(setHistoryItem({ phrases: cards }));
      navigation.navigate("Flashcards", { title });
    },
    [params, navigation]
  );
  // get language 2 flascards quickly
  const getPhraseCardsByLanguageTwo = useCallback(
    async (itemKey) => {
      const dataKey = params.mode === "to";
      let cards = [];
      cards = await getPhraseCardsLanguageTwo(
        userData.userId,
        userData.languageTwo,
        dataKey,
        itemKey
      );
      const title = userData.languageTwo;
      dispatch(setHistoryItem({ phrases: cards }));
      navigation.navigate("Flashcards", { title });
    },
    [params, navigation]
  );

  return (
    <View>
      <View
        style={{
          marginHorizontal: 44,
          marginVertical: 0,
          backgroundColor: colors.lightGrey,
        }}
      >
        <TouchableOpacity
          onPress={getPhraseCardsByLanguage}
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginHorizontal: 0,
            marginVertical: 0,
            // backgroundColor: colors.lightGrey,
            borderRadius: 10,
            padding: 10,
            width: "100%",
            borderColor: colors.white,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontFamily: "regular",
              color: colors.defaultTextColor,
              marginHorizontal: 5,
              marginVertical: 10,
            }}
          >
            {" "}
            {(userData.language === "af" && "Africaans") ||
              (userData.language === "sq" && "Albanian") ||
              (userData.language === "am" && "Amharic") ||
              (userData.language === "ar" && "Arabic") ||
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
        {userData.languageTwo && userData.languageTwo.length >= 2 && (
          <TouchableOpacity
            onPress={getPhraseCardsByLanguageTwo}
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginHorizontal: 0,
              marginVertical: 0,
              backgroundColor: colors.lightGrey,
              borderRadius: 10,
              padding: 10,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily: "regular",
                color: colors.defaultTextColor,
                marginHorizontal: 5,
                marginVertical: 10,
              }}
            >
              {" "}
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
        )}
      </View>

      <FlatList
        data={Object.keys(supportedLanguages)}
        keyExtractor={(item) => item}
        renderItem={(itemData) => {
          const languageKey = itemData.item;
          const languageString = supportedLanguages[languageKey];

          return (
            <LanguageItem
              text={languageString}
              selected={languageString === selected ? true : false}
              onPress={() => {
                onLanguageSelect(languageKey);
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default LanguageBoxScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allButton: {
    color: colors.orange,
    fontSize: 16,
    fontFamily: "bold",
    marginLeft: 10,
  },
});
