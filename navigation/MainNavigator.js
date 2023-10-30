import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PhraseBookScreen from "../src/screens/PhraseBookScreen";
import ChatListScreen from "../src/screens/ChatListScreen";
import SettingsScreen from "../src/screens/SettingsScreen";
import ContactsScreen from "../src/screens/ContactsScreen";
import NewChatScreen from "../src/screens/NewChatScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthScreen from "../src/screens/AuthScreen";
import ChatScreen from "../src/screens/ChatScreen";
import { useSelector } from "react-redux";
import { getFirebase } from "../utils/firebaseHelper";
import Purchases from "react-native-purchases";
import {
  child,
  get,
  getDatabase,
  off,
  onValue,
  ref,
  limitToLast,
  query,
  orderByChild,
  orderByKey,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { setChatsData } from "../store/chatSlice";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages } from "../store/messagesSlice";
import LanguageSelectScreen from "../src/screens/LanguageSelectScreen";
import LanguageMessageSelect from "../src/screens/LanguageMessageSelect";
import { setHistoryItem } from "../store/historySlice";
import colors from "../constants/colors";
import ContactScreen from "../src/screens/ContactScreen";
import GroupChatSettingsScreen from "../src/screens/GroupChatSettingsScreen";
import AllParticipantsScreen from "../src/screens/AllParticipantsScreen";
import LanguageBoxScreen from "../src/screens/LanguageBoxScreen";
import FindLangs from "../src/screens/FindLangs";
import PaymentScreen from "../src/screens/PaymentScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HelpScreen from "../src/screens/HelpScreen";
import LanguageSelectMFrom from "../src/screens/LanguageSelectMFrom";
import LanguageSelectPF from "../src/screens/LanguageSelectPF";
import TermsOfService from "../src/screens/TermsOfService";
import PrivacyPolicy from "../src/screens/PrivacyPolicy";
import AccountSettings from "../src/screens/AccountSettings";
import EULA from "../src/screens/EULA";
import ForgotPassword from "../src/screens/ForgotPassword";
import FindNatives from "../src/screens/FindNatives";
import InfoScreen from "../src/screens/InfoScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function TabNavigator(props) {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Settings") {
            iconName = focused ? "settings-outline" : "settings-outline";
          }
          if (route.name === "PhraseBook" || route.name === "Flashcards") {
            iconName = focused ? "book" : "book";
          }
          if (route.name === "Chats") {
            iconName = focused
              ? "chatbox-ellipses-outline"
              : "chatbox-ellipses-outline";
          }
          if (route.name === "Langs") {
            iconName = focused ? "md-people" : "md-people";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Flashcards"
        component={PhraseBookScreen}
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name={"Chats"}
        component={ChatListScreen}
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Langs"
        component={FindLangs}
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}

const APIKeys = {
  apple: "appl_iBwupnXztfutoEAHoCNgoBBkpER",
};
//Todo: check if this is the right place to put this
// ? is this put in the right place?

const MainNavigator = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const messagePages = useSelector((state) => state.messages.perPage);

  const [isLoading, setIsLoading] = React.useState(true);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        const chatId = data["chatId"];
        if (chatId) {
          // clear badge count added this here
          //Todo: check if this is the right place to put this maybe take out badgecount
          Notifications.setBadgeCountAsync(0);
          const pushAction = StackActions.push("Chat", {
            chatId,
          });
          navigation.dispatch(pushAction);
        } else {
          console.log("no chatId in notification data");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  //? allows listening for retrieval of the user chats when the app starts up with this useEffect data
  useEffect(() => {
    console.log("subscribing to firebase users");
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    //make sure that only the new users chats are loaded
    if (!userData) {
      return;
    }

    const userChatRef = child(dbRef, `userChats/${userData.userId}`);
    const refs = [userChatRef];
    if (!userChatRef) {
      return;
    }
    // implement pagination here

    onValue(userChatRef, (snapshot) => {
      // limit the amount of pages to be retrieved

      const chatIdsData = snapshot.val() || {};
      const chatIds = Object.values(chatIdsData);

      const chatsData = {};
      let chatsFoundCount = 0;

      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = child(dbRef, `chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++;
          // shows all loaded chats
          const data = chatSnapshot.val();

          if (data) {
            if (!data.users.includes(userData.userId)) {
              return;
            }
            data.key = chatSnapshot.key;
            data.users.forEach((userId) => {
              if (storedUsers[userId]) return;

              const userRef = child(dbRef, `users/${userId}`);
              get(userRef).then((userSnapshot) => {
                const userSnapshotData = userSnapshot.val();
                dispatch(
                  setStoredUsers({
                    newUsers: { userSnapshotData },
                  })
                );
              });
              refs.push(userRef);
            });
            chatsData[chatSnapshot.key] = data;
          }
          //allows for the loading of the chats to be shown in chatlist
          if (chatsFoundCount >= chatIds.length) {
            dispatch(setChatsData({ chatsData }));
            setIsLoading(false);
          }
        });
        // allows for messages to come out 0 at a time PAGINATION
        // getting our messages
        const messagesRef = query(
          child(dbRef, `messages/${chatId}`),
          orderByKey(orderByChild("createdAt")),
          limitToLast(messagePages)
        );
        // const messagesRef = child(dbRef, `messages/${chatId}`);
        refs.push(messagesRef);
        onValue(messagesRef, (messagesSnapshot) => {
          const messagesData = messagesSnapshot.val();
          dispatch(setChatMessages({ chatId, messagesData }));
        });
      }
      if (chatsFoundCount == 0) {
        setIsLoading(false);
      }
    });

    //! Pulls up the user's Phrases in the PhraseBook from db ans sets it to the state global

    const phrasesRef = query(
      child(dbRef, `userPhrases/${userData.userId}`),
      orderByKey(orderByChild("createdAt")),
      limitToLast(8)
    );
    refs.push(phrasesRef);

    onValue(phrasesRef, (snapshot) => {
      let phrases = [];
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        phrases.push(childData);
      });

      dispatch(setHistoryItem({ phrases }));
    });

    return () => {
      console.log("unsubscribing from firebase users");
      refs.forEach((ref) => {
        off(ref);
      });
    };
  }, [userData, storedUsers, dispatch, messagePages]);
  // !end of use effect

  useEffect(() => {
    const getUserId = async () => {
      const userData = await AsyncStorage.getItem("userData");
      await Purchases.setDebugLogsEnabled(true);

      if (userData) {
        await Purchases.configure({
          apiKey: APIKeys.apple,
          appUserID: JSON.parse(userData).userId,
        });
        const { customerInfo } = await Purchases.logIn(
          JSON.parse(userData).userId
        );
        console.log("customerInfoLogin", customerInfo);
      }
    };
    getUserId();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="TabNavigator">
      <Stack.Group>
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: true, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{
            headerTitle: "Cancel anytime",
            headerShadowVisible: false,
            headerTintColor: "black",
          }}
        />

        <Stack.Screen
          name="GroupChatSettings"
          component={GroupChatSettingsScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ContactPage"
          component={ContactScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="findNatives"
          component={FindNatives}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerTintColor: "black", // Set the color you want here
          }}
        />
        <Stack.Screen
          name="forgotPassword"
          component={ForgotPassword}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerTintColor: "black", // Set the color you want here
          }}
        />

        <Stack.Screen
          name="accountSetting"
          component={AccountSettings}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "containedModal" }}>
        <Stack.Screen
          name="NewChat"
          component={NewChatScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="languageSelect"
          component={LanguageSelectScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            presentation: "modal",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="languageSelectM"
          component={LanguageMessageSelect}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            presentation: "modal",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="languageSelectMF"
          component={LanguageSelectMFrom}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            presentation: "modal",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="languagePF"
          component={LanguageSelectPF}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            presentation: "modal",
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="contacts"
          component={ContactsScreen}
          options={{
            headerTitle: "Invite a Friend",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="termsOfService"
          component={TermsOfService}
          options={{
            headerTitle: "Terms of Service",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="privacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerTitle: "Privacy Policy",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="eula"
          component={EULA}
          options={{
            headerTitle: "End User License Agreement",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="AllParticipants"
          component={AllParticipantsScreen}
          options={{
            headerTitle: "All Participants",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{
            headerTitle: "Information",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="LanguageBox"
          component={LanguageBoxScreen}
          options={{
            headerTitle: "Choose a Language Category",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="info"
          component={InfoScreen}
          options={{
            headerTitle: "Langiddy FAQ",
            headerShadowVisible: false,
            presentation: "modal",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigator;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",

      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}
