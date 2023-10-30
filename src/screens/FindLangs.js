import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  Button,
} from "react-native";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { searchUsersLanguage } from "../../utils/actions/userActions";
import { useSelector } from "react-redux";
import colors from "../../constants/colors";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import LogoNew from "../../assets/images/LogoNew.png";
import DropDownPicker from "react-native-dropdown-picker";
import { useCallback } from "react";
import { updateSignedInUserData } from "../../utils/actions/authActions";
import { updateLoggedInUserData } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { setStoredUsers } from "../../store/userSlice";
import * as StoreReview from "expo-store-review";
import PaymentScreen from "./PaymentScreen";
import Purchases from "react-native-purchases";
import PageContainer from "../../components/PageContainer";
import mobileAds, {
  TestIds,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { getDatabase, ref, set, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirebase } from "../../utils/firebaseHelper";

// Todo: put in actual ID
const adUnitId = "ca-app-pub-7278635770152409/2276857476";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
// put id here is a test id
// const interstitial = InterstitialAd.createForAdRequest(
//   "ca-app-pub-3940256099942544/4411468910"
// );

const FindLangs = (props) => {
  const [locale, setLocale] = React.useState(Localization.locale);

  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);
  const [firstSeen, setFirstSeen] = useState(true);

  const i18n = new I18n({
    "en-US": {
      "Waiting for more people learning": "Waiting for more people learning",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "See who is learning other languages by tapping the drop down menu above and select a language",
      "After you select a language, Swipe down to load more Langs!":
        "After you select a language, Swipe down to load more Langs!",
    },
    "en-MX": {
      "Waiting for more people learning":
        "Actualmente, no hay más usuarios aprendiendo",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "Ver quién está aprendiendo otros idiomas tocando el menú desplegable de arriba y seleccionando un idioma",
      "After you select a language, Swipe down to load more Langs!":
        "Desliza hacia abajo para encontrar más idiomas",
    },
    "es-MX": {
      "Waiting for more people learning":
        "Actualmente, no hay más usuarios aprendiendo",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "Ver quién está aprendiendo otros idiomas tocando el menú desplegable de arriba y seleccionando un idioma",
      "After you select a language, Swipe down to load more Langs!":
        "Desliza hacia abajo para encontrar más idiomas",
    },
    "en-JP": {
      "Waiting for more people learning":
        "現在、他の言語を学んでいるユーザーはいません",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "上のドロップダウンメニューをタップして他の言語を学んでいる人を見る。言語を選択します。",
      "After you select a language, Swipe down to load more Langs!":
        "下にスワイプして他の言語を見つける",
    },
    "ja-JP": {
      "Waiting for more people learning":
        "現在、他の言語を学んでいるユーザーはいません",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "上のドロップダウンメニューをタップして他の言語を学んでいる人を見る。言語を選択します。",
      "After you select a language, Swipe down to load more Langs!":
        "下にスワイプして他の言語を見つける",
    },
    "en-CN": {
      "Waiting for more people learning": "目前，没有更多的用户在学习",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "通过点击上面的下拉菜单查看谁在学习其他语言。选择一种语言。",
      "After you select a language, Swipe down to load more Langs!":
        "向下滑动以查找更多语言",
    },
    "zh-CN": {
      "Waiting for more people learning": "目前，没有更多的用户在学习",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "通过点击上面的下拉菜单查看谁在学习其他语言。选择一种语言。",
      "After you select a language, Swipe down to load more Langs!":
        "向下滑动以查找更多语言",
    },
    "zh-TW": {
      "Waiting for more people learning": "目前，沒有更多的用戶在學習",
      "See who is learning other languages by tapping the drop down menu above and select a language":
        "通過點擊上面的下拉菜單查看誰在學習其他語言。選擇一種語言。",
      "After you select a language, Swipe down to load more Langs!":
        "向下滑動以查找更多語言",
    },
  });
  i18n.defaultLocale = "en-US";
  i18n.locale = locale;
  i18n.enableFallback = true;

  // add state for ad
  const [showAd, setShowAd] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  // state for counter of when to display add
  const [counter, setCounter] = useState(0);

  const chatId = props.route.params && props.route?.params?.chatId;
  const [langs, setLangs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [paywallShown, setPaywallShown] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  const dispatch = useDispatch();

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);

  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(null);
  const [lang1, setLang1] = React.useState([
    { label: "Africkaans", value: "af" },
    { label: "Albanian", value: "sq" },
    { label: "Amharic", value: "am" },
    { label: "Arabic", value: "ar" },
    { label: "Armenian", value: "hy" },
    { label: "Azeerbaijani", value: "az" },
    { label: "Bashkir", value: "ba" },
    { label: "Basque", value: "eu" },
    { label: "Belarusian", value: "be" },
    { label: "Bengali", value: "bn" },
    { label: "Bosnian", value: "bs" },
    { label: "Bulgarian", value: "bg" },
    { label: "Catalan", value: "ca" },
    { label: "Cebuano", value: "ceb" },
    { label: "Chichewa", value: "ny" },
    { label: "Chinese (Simplified)", value: "zh-CN" },
    { label: "Chinese (Traditional)", value: "zh-TW" },
    { label: "Corsican", value: "co" },
    { label: "Croatian", value: "hr" },
    { label: "Czech", value: "cs" },
    { label: "Danish", value: "da" },
    { label: "Dutch", value: "nl" },
    { label: "English", value: "en" },
    { label: "Esperanto", value: "eo" },
    { label: "Estonian", value: "et" },
    { label: "Finnish", value: "fi" },
    { label: "French", value: "fr" },
    { label: "Frisian", value: "fy" },
    { label: "Galician", value: "gl" },
    { label: "Georgian", value: "ka" },
    { label: "German", value: "de" },
    { label: "Greek", value: "el" },
    { label: "Gujarati", value: "gu" },
    { label: "Haitian Creole", value: "ht" },
    { label: "Hausa", value: "ha" },
    { label: "Hawaiian", value: "haw" },
    { label: "Hebrew", value: "he" },
    { label: "Hindi", value: "hi" },
    { label: "Hmong", value: "hmn" },
    { label: "Hungarian", value: "hu" },
    { label: "Icelandic", value: "is" },
    { label: "Igbo", value: "ig" },
    { label: "Indonesian", value: "id" },
    { label: "Irish", value: "ga" },
    { label: "Italian", value: "it" },
    { label: "Japanese", value: "ja" },
    { label: "Javanese", value: "jw" },
    { label: "Kannada", value: "kn" },
    { label: "Kazakh", value: "kk" },
    { label: "Khmer", value: "km" },
    { label: "Kinyarwanda", value: "rw" },
    { label: "Korean", value: "ko" },
    { label: "Kurdish (Kurmanji)", value: "ku" },
    { label: "Kyrgyz", value: "ky" },
    { label: "Lao", value: "lo" },
    { label: "Latin", value: "la" },
    { label: "Latvian", value: "lv" },
    { label: "Lithuanian", value: "lt" },
    { label: "Luxembourgish", value: "lb" },
    { label: "Macedonian", value: "mk" },
    { label: "Malagasy", value: "mg" },
    { label: "Malay", value: "ms" },
    { label: "Malayalam", value: "ml" },
    { label: "Maltese", value: "mt" },
    { label: "Maori", value: "mi" },
    { label: "Marathi", value: "mr" },
    { label: "Mongolian", value: "mn" },
    { label: "Myanmar (Burmese)", value: "my" },
    { label: "Nepali", value: "ne" },
    { label: "Norwegian", value: "no" },
    { label: "Nyanja (Chichewa)", value: "ny" },
    { label: "Pashto", value: "ps" },
    { label: "Persian", value: "fa" },
    { label: "Polish", value: "pl" },
    { label: "Portuguese (Portugal, Brazil)", value: "pt" },
    { label: "Punjabi", value: "pa" },
    { label: "Romanian", value: "ro" },
    { label: "Russian", value: "ru" },
    { label: "Samoan", value: "sm" },
    { label: "Scots Gaelic", value: "gd" },
    { label: "Serbian", value: "sr" },
    { label: "Sesotho", value: "st" },
    { label: "Shona", value: "sn" },
    { label: "Sindhi", value: "sd" },
    { label: "Sinhala (Sinhalese)", value: "si" },
    { label: "Slovak", value: "sk" },
    { label: "Slovenian", value: "sl" },
    { label: "Somali", value: "so" },
    { label: "Spanish", value: "es" },
    { label: "Sundanese", value: "su" },
    { label: "Swahili", value: "sw" },
    { label: "Swedish", value: "sv" },
    { label: "Tagalog (Filipino)", value: "tl" },
    { label: "Tajik", value: "tg" },
    { label: "Tamil", value: "ta" },
    { label: "Tatar", value: "tt" },
    { label: "Telugu", value: "te" },
    { label: "Thai", value: "th" },
    { label: "Turkish", value: "tr" },
    { label: "Turkmen", value: "tk" },
    { label: "Ukrainian", value: "uk" },
    { label: "Urdu", value: "ur" },
    { label: "Uyghur", value: "ug" },
    { label: "Uzbek", value: "uz" },
    { label: "Vietnamese", value: "vi" },
    { label: "Welsh", value: "cy" },
    { label: "Xhosa", value: "xh" },
    { label: "Yiddish", value: "yi" },
    { label: "Yoruba", value: "yo" },
    { label: "Zulu", value: "zu" },
  ]);

  const [userPress, setUserPress] = useState(true);

  // Todo: call this function when user press the button onPass 4 times
  const loadInterstitialAdd = () => {
    // this loads the ad
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setShowAd(true);
      }
    );
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setShowAd(false);
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  };
  useEffect(() => {
    // calls when component mounts to load add
    //step 1
    const unsubscribeInterstitial = loadInterstitialAdd();
    return unsubscribeInterstitial;
  }, []);
  // gets all users from the database
  const getAllUsers = async () => {
    const allUsers = await searchUsersLanguage(
      userData.language,
      userData.languageFrom
    );
    setAllUsers(allUsers);
    setLangs(Object.values(allUsers));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setLangs([]);
    getAllUsers();
    setRefreshing(false);
  };

  // gets a completely random user from the database
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const sendMessageToLang = async (item) => {
    if (!userData.language || !userData.languageFrom) {
      Alert.alert("Please select your languages in settings");
    } else {
      userPressed(item.userId);
    }
  };

  const onPass = async (item) => {
    setLangs((prevLangs) =>
      prevLangs.filter(
        (user) =>
          user.userId !== item &&
          user.userId !== userData.userId &&
          user.hidden === false &&
          // user.isOnline === true &&
          user.languageFrom === userData.languageFrom &&
          user.language === userData.language
      )
    );
    // code for activating add if user is not a subscriber every 5 passes
    setCounter(counter + 1);
    if (counter >= 8 && activeSubscriptions.length === 0) {
      //TODO: show add june 15th acct suspended for now
      interstitial.show();
      setCounter(0);
    }
  };

  const userPressed = async (item) => {
    // gets new data whenever a user messages someone to keep the data up to date and users hidden or giddy.
    setTimeout(() => {
      onRefresh();
    }, 500);
    // dispatch(setStoredUsers({ newUsers: item }));
    props.navigation.navigate("Chats", {
      selectedUserId: item,
    });
  };

  useEffect(() => {
    // set stored users allows for name to show when user presses on a user
    dispatch(setStoredUsers({ newUsers: langs }));
  }, [langs, dispatch]);

  const saveHandlerLanguage = useCallback(async () => {
    try {
      await updateSignedInUserData(userData.userId, {
        language: value2,
      });

      dispatch(
        updateLoggedInUserData({
          newData: {
            language: value2,
          },
        })
      );
    } catch (err) {
    } finally {
    }
  }, [value2, dispatch]);

  useEffect(() => {
    getUserInfo();
    // checks for updates to users subscription
    Purchases.addCustomerInfoUpdateListener((info) => {
      getUserInfo();
    });
  }, []);
  const getUserInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      // access latest customerInfo
      const { activeSubscriptions } = customerInfo;
      console.log("activeSubscriptions", activeSubscriptions);
      setActiveSubscriptions(activeSubscriptions);
      // console.log("customerInfo", customerInfo);
    } catch (e) {
      // Error fetching customer info
      console.log("error fetching customer info", e);
    }
  };
  //TOdo: made it free for now
  const goContactPage = (item) => {
    props.navigation.navigate("ContactPage", {
      user: item,
    });
  };

  useEffect(() => {
    // if they come to this page for the first time show an arrow pointing to the magnifying glass
    if (firstSeen) {
      setFirstSeen(false);
      // send first seen to firebase
      const db = getDatabase();
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user.uid;
      const updates = {};
      updates["/users/" + uid + "/firstSeenLangs"] = true;
      update(ref(db), updates);

      if (
        userData.firstSeenLangs === false ||
        userData.firstSeenLangs === undefined ||
        userData.firstSeenLangs === null
      ) {
        // show alert
        Alert.alert(
          "Welcome to Langs!",
          "Use the drop-down menu above to find people learning specific languages. Tap `Next` to show the next user or tap the magnifying glass for native speakers.",
          [
            {
              text: "Got it!",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    }
  }, []);

  const randomBreaktheIceSaying = () => {
    const status = [
      "I'm learning a new language, can you help me?",
      "Hi there! I'm trying to improve my language skills. Can we practice together?",
      "Greetings! Looking for someone to practice language with. Interested?",
      "Hey! Are you also into language learning? Let's chat!",
      "Hello! Want to have a language exchange conversation?",
      "Hey! I'm on a mission to become fluent in a new language. Want to join me?",
      "Hi! I'm exploring a new language. Can you give me some tips?",
      "Greetings! Want to practice speaking in a different language?",
      "Hey there! Let's break the language barrier together!",
      "Hi! I'm trying to brush up my language skills. Can you lend a hand?",
      "Hello! Let's have a chat in our target languages!",
      "Hey! Looking for a language learning buddy. Interested?",
      "Hi there! Want to exchange languages and culture?",
      "Greetings! I'm learning a new language. Care to join me?",
      "Hello! I need some practice in my target language. Can you help?",
      "Hey! Let's practice speaking in a foreign language!",
      "Hi! Want to improve our language skills together?",
      "Greetings! I'm excited to learn a new language. Let's talk!",
      "Hello! Seeking someone to chat in my target language. Any takers?",
      "Hi there! Let's have a fun language exchange session!",
    ];

    const randomStatus = status[Math.floor(Math.random() * status.length)];
    return randomStatus;
  };

  if (paywallShown) {
    return (
      <PageContainer>
        <PaymentScreen setTrue={() => setPaywallShown(false)} />
      </PageContainer>
    );
  }

  //

  if (
    langs.length === 0 ||
    langs.filter(
      (user) =>
        user.userId !== userData.userId &&
        user.hidden === false &&
        user.languageFrom === userData.languageFrom &&
        user.language === userData.language
    ).length === 0
  ) {
    return (
      <SafeAreaView style={styles.ContainerTrue}>
        <View style={styles.langcontainerTop}>
          <PageTitle title="Find Langs" />
          <Image source={LogoNew} style={styles.langC} />
        </View>
        <View>
          {userPress && (
            <DropDownPicker
              labelStyle={{
                fontSize: 22,
                fontFamily: "semiBold",
                color: colors.orange,
              }}
              textStyle={{
                fontSize: 22,
                fontFamily: "semiBold",
                color: colors.defaultTextColor,
                left: 3,
              }}
              autoScroll={true}
              open={open2}
              searchable={true}
              searchPlaceholder="Enter a language"
              value={value2}
              items={lang1}
              setOpen={setOpen2}
              setValue={setValue2}
              setItems={setLang1}
              onChangeValue={(value) => {
                setValue2(value);
                saveHandlerLanguage();
              }}
              listMode="MODAL"
              placeholder={
                (userData.language === "af" && "Africaans") ||
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
                (userData.language === "zu" && "Zulu")
              }
              style={{
                backgroundColor: colors.white,
                borderColor: colors.white,
                width: Platform.isPad ? "88%" : "80.2%",
                height: 50,
                marginTop: -13,
              }}
            />
          )}
        </View>

        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onLongPress={() => Alert.alert("Tap to search for native speakers")}
          onPress={() => props.navigation.navigate("findNatives")}
          style={{
            position: "absolute",
            right: 15,
            top: Platform.isPad ? 100 : 80,
            right: Platform.isPad ? 175 : 20,
          }}
        >
          <FontAwesome name="search" size={26} color={colors.orange} />
        </TouchableOpacity>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.noLangs}>
            <Text style={styles.noLangsText}>
              {i18n.t("Waiting for more people learning")}{" "}
              {(userData.language === "af" && "Afrikaans") ||
                (userData.language === "ar" && "Arabic") ||
                (userData.language === "sq" && "Albanian") ||
                (userData.language === "am" && "Amharic") ||
                (userData.language === "hy" && "Armenian") ||
                (userData.language === "az" && "Azerbaijani") ||
                (userData.language === "eu" && "Basque") ||
                (userData.language === "be" && "Belarusian") ||
                (userData.language === "bn" && "Bengali") ||
                (userData.language === "bs" && "Bosnian") ||
                (userData.language === "bg" && "Bulgarian") ||
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
                (userData.language === "ny" && "Nyanja (Chichewa)") ||
                (userData.language === "ps" && "Pashto") ||
                (userData.language === "fa" && "Persian") ||
                (userData.language === "pl" && "Polish") ||
                (userData.language === "pt" && "Portuguese") ||
                (userData.language === "pa" && "Punjabi") ||
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
              ...
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 20,
                color: colors.defaultTextColor,
                paddingTop: 80,
                lineHeight: 28,
              }}
            >
              Connect with fellow learners across different languages. Use the{" "}
              <Text style={{ fontFamily: "bold" }}>drop down</Text> menu above
              to choose a language. Then,{" "}
              <Text style={{ fontFamily: "bold" }}>swipe down</Text> to see who
              is learning that language!
            </Text>

            <Text
              style={{
                marginTop: 50,
                color: colors.defaultTextColor,
                fontFamily: "semiBold",
                fontSize: 18,
              }}
            >
              Or
            </Text>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("contacts");
              }}
              style={{
                marginBottom: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "orange",
                  paddingTop: 50,
                }}
              >
                Invite Friends from Contacts
              </Text>
            </TouchableOpacity>
            <Text></Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.ContainerTrue}>
      <View style={styles.langcontainerTop}>
        <PageTitle title="Find Langs" />
        <Image source={LogoNew} style={styles.langC} />
      </View>
      <View>
        {userPress && (
          <DropDownPicker
            labelStyle={{
              fontSize: 22,
              fontFamily: "semiBold",
              color: colors.orange,
            }}
            textStyle={{
              fontSize: 22,
              fontFamily: "semiBold",
              color: colors.orange,
              left: 3,
            }}
            autoScroll={true}
            open={open2}
            value={value2}
            items={lang1}
            setOpen={setOpen2}
            setValue={setValue2}
            searchable={true}
            searchPlaceholder="Enter a language"
            setItems={setLang1}
            listMode="MODAL"
            onChangeValue={(value) => {
              setValue2(value);
              saveHandlerLanguage();
            }}
            placeholder={
              (userData.language === "af" && "Africaans") ||
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
              (userData.language === "zu" && "Zulu")
            }
            style={{
              backgroundColor: colors.white,
              borderColor: colors.white,
              width: Platform.isPad ? "88%" : "80.2%",
              height: 50,
              marginBottom: -1,
              // position: "absolute",
              marginTop: -13,
              marginLeft: 0,
            }}
          />
        )}
      </View>

      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onLongPress={() => Alert.alert("Tap to search for native speakers")}
        onPress={() => props.navigation.navigate("findNatives")}
        style={{
          position: "absolute",
          right: 15,
          top: Platform.isPad ? 100 : 80,
          right: Platform.isPad ? 175 : 20,
        }}
      >
        <FontAwesome name="search" size={26} color={colors.orange} />
      </TouchableOpacity>
      {
        //? if there are  users that are learning the same language not including the user, then show this
        langs.length !== 0 && (
          <FlatList
            data={shuffleArray(langs).filter(
              (user) =>
                //? if the user is not the same user and the user is learning the same language as the user, then show them
                user.userId !== userData.userId &&
                user.hidden === false &&
                user.languageFrom === userData.languageFrom &&
                user.language === userData.language
            )}
            keyExtractor={(item) => item.userId}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const {
                firstName,
                lastName,
                firstLast,
                status,
                onlineStatus,
                profilePic,
                isOnline,
              } = item;

              return (
                <ScrollView style={styles.personContainer}>
                  <View>
                    <TouchableOpacity onPress={() => goContactPage(item)}>
                      {profilePic ? (
                        <Image
                          style={styles.image}
                          source={{
                            uri: profilePic,
                          }}
                        />
                      ) : (
                        <Image
                          style={styles.image}
                          source={require("../../assets/images/defaultPic10.png")}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 5,
                    }}
                  >
                    <>
                      <Text adjustsFontSizeToFit style={styles.nameF}>
                        {firstName || firstLast}{" "}
                      </Text>
                      <Text adjustsFontSizeToFit style={styles.nameL}>
                        {lastName || ""}
                      </Text>
                    </>
                    {/* )} */}
                  </View>

                  {onlineStatus && (
                    <Text
                      style={{
                        color: colors.orange,
                        fontSize: 12,
                        marginTop: 2,
                        // paddingLeft: 5,
                      }}
                    ></Text>
                  )}
                  {!onlineStatus && (
                    <Text
                      style={{
                        color: colors.orange,
                        fontSize: 12,
                        marginTop: 2,
                        // paddingLeft: 5,
                      }}
                    ></Text>
                  )}

                  <Text adjustsFontSizeToFit style={styles.nameAbout}>
                    {status ? status : randomBreaktheIceSaying()}
                  </Text>

                  <View style={styles.buttons}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                      onLongPress={() => Alert.alert("Show another person!")}
                      onPress={() => onPass(item.userId)}
                    >
                      <MaterialIcons
                        name="next-plan"
                        size={72}
                        color={colors.white}
                        style={{
                          transform: [{ rotate: "360deg" }],
                          shadowColor: "rgba(0,0,0, .4)",
                          shadowOffset: { height: 1, width: 1 },
                          shadowOpacity: 1,
                          shadowRadius: 1,
                          opacity: 0.8,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.closeButton,
                      }}
                      hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                      onLongPress={() =>
                        Alert.alert("Send this user a message!")
                      }
                      onPress={() => {
                        sendMessageToLang(item);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="send-circle"
                        size={72}
                        color={colors.orange}
                        style={{
                          transform: [{ rotate: "360deg" }],
                          shadowColor: "rgba(0,0,0, .4)",
                          shadowOffset: { height: 1, width: 1 },
                          shadowOpacity: 1,
                          shadowRadius: 1,
                          opacity: 0.8,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              );
            }}
          />
        )
      }
    </SafeAreaView>
  );
};

// put in adjust size to fit

export default FindLangs;
const styles = StyleSheet.create({
  ContainerTrue: {
    paddingHorizontal: Platform.isPad && 170,
    backgroundColor: colors.white,
    height: "100%",
    width: "100%",
    flex: 1,
  },
  personContainer: {
    flex: 1,
    width: "98%",
    marginLeft: "1%",
    padding: 5,
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: 5,
  },

  image: {
    width: "100%",
    flex: 1,
    height: Platform.isPad ? 720 : 400,
    marginTop: 10,
    borderRadius: 5,
    paddingBottom: 50,
  },
  nameText: {
    fontSize: Platform.isPad ? 30 : 20,
    padding: 2.6,
    maxWidth: 200,
    maxHeight: 50,
    fontFamily: "regular",
    color: colors.orange,
    marginBottom: 10,
    resizeMode: "contain",
  },
  buttons: {
    flexDirection: "column",
    position: "absolute",
    marginLeft: "80%",
    marginTop: Platform.isPad ? "71%" : "71%",
    right: 0,
    bottom: 110,
  },

  noLangs: {
    alignItems: "center",

    margin: 10,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,

    height: 545,
    marginTop: 18,
  },
  noLangsText: {
    fontSize: 20,
    fontFamily: "regular",
    color: colors.defaultTextColor,
    marginBottom: 10,
    padding: 0,
  },
  langContanerES: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  langContanerESNOTWO: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "25%",
  },
  LogoNew: {
    padding: 10,
    width: 100,
    height: 100,
    position: "absolute",
    resizeMode: "contain",
    marginLeft: "62%",

    // marginTop: "147%",
  },
  langcontainerTop: {
    marginLeft: 20,
    // paddingBottom: 10,
    paddingBottom: Platform.isPad ? "2.6%" : "6.2%",
    flexDirection: "row",
  },
  nameFL: {
    fontSize: 20,
    maxWidth: 200,
    maxHeight: 50,
    marginRight: 200,
    fontWeight: "bold",
    color: colors.defaultTextColor,
    opacity: 0.8,
    marginBottom: 10,
    resizeMode: "contain",
  },
  nameAbout: {
    fontSize: 18,
    maxWidth: "100%",
    maxHeight: 48,
    minHeight: 41,
    fontFamily: "regular",
    color: colors.black,
    opacity: 0.8,
    marginBottom: 10,
    resizeMode: "contain",
  },
  langC: {
    resizeMode: "contain",
    // width: 100,
    // height: 100,
    width: Platform.isPad ? 80 : 100,
    height: Platform.isPad ? 80 : 100,
    position: "absolute",
    marginLeft: Platform.isPad ? "80%" : "62%",
  },
  twoLanguage: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    paddingLeft: 10,
  },
  nameF: {
    fontSize: 20,
    maxWidth: 450,
    maxHeight: 50,
    fontWeight: "bold",
    color: colors.defaultTextColor,
    opacity: 0.8,
    marginBottom: 10,
    resizeMode: "contain",
  },
  nameL: {
    fontSize: 20,
    maxWidth: 450,
    maxHeight: 50,
    fontWeight: "bold",
    color: colors.defaultTextColor,
    opacity: 0.8,
    marginBottom: 10,
    resizeMode: "contain",
  },
  dropDown: {
    width: "50%",
    height: 50,
    backgroundColor: colors.grey,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

//? if the user is not the current user, then show them if the language from is the same as the user's language and either the users language or languageTwo is the same as the users language or languageTwo or languageFrom.
// user.userId !== userData.userId &&
// user.languageFrom === userData.languageFrom &&
// (user.language === userData.language ||
//   user.languageTwo === userData.language ||
//   user.language === userData.languageTwo ||
//   user.languageTwo === userData.languageTwo)

//?not best but kinda works
