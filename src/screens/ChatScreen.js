import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Text,
  Linking,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import backgroundImage from "../../assets/images/doodles.png";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import { Feather, Ionicons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../../components/CustomHeaderButton";
import { useSelector } from "react-redux";
import Bubble from "../../components/Bubble";
import BubblePageContainer from "../../components/BubblePageContainer";
import ProfileImage from "../../components/ProfileImage";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import {
  createChat,
  getLatestMessageIds,
  getMessageById,
  checkIfBlocked,
  sendImage,
  sendTextMessage,
  updateMessageTranslation,
} from "../../utils/actions/chatActions";
import {
  translateTextMessage,
  translateTextMessageNonRoman,
} from "../../utils/translation";
import moment from "moment";
import ReplyTo from "../../components/ReplyTo";
import {
  launchImagePicker,
  openCamera,
  uploadImageAsync,
} from "../../utils/imagePickerHelper";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../../constants/colors";
import { useHeaderHeight } from "@react-navigation/elements";
import TextareaAutosize from "react-textarea-autosize";
import Voice from "@react-native-voice/voice";
import PageContainer from "../../components/PageContainer";
import PaymentScreen from "./PaymentScreen";
import Purchases from "react-native-purchases";
import ProfileImageNonCached from "../../components/ProfileImageNonCached";
import { getFirebase } from "../../utils/firebaseHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setChatMessages, setPage } from "../../store/messagesSlice";
import { FlashList } from "@shopify/flash-list";
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import MainProfilePic from "../../components/MainProfilePic";
import ImageSettingsHelper from "../../components/ImageSettingsHelper";

const translationCache = new Map();
const MAX_CACHE_SIZE = 100;
const MAX_TRANSLATION_RETRIES = 3;

const ChatScreen = (props) => {
  const params = props.route.params || {};
  console.log("params", params);
  const headerHeight = useHeaderHeight();

  // TODO: Pagination
  const perPage = useSelector((state) => state.messages.perPage);
  const currentPage = useSelector((state) => state.messages.page);

  //? LOCAL STATE

  const [paywallShown, setPaywallShown] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [height, setHeight] = useState(41);
  const [selectedFrom, setSelectedFrom] = useState(false);
  const [selectedTo, setSelectedTo] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [translation, setTranslation] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [image, setImage] = useState(props.route?.params?.image);
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [textOnly, setTextOnly] = useState(false);
  const [receiverHasRead, setReceiverHasRead] = useState(
    props.route?.params?.receiverHasRead || false
  );

  const flatList = React.useRef();

  //? REDUX STATE
  const userData = useSelector((state) => state.auth.userData);

  // show typing indicator on other users screen using firebase real time database

  const [languageTo, setLanguageTo] = React.useState(userData.language || "");
  const [languageFrom, setLanguageFrom] = React.useState("");
  const [activeSubscriptions, setActiveSubscriptions] = React.useState([]);

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const chatMessages = useSelector((state) => {
    if (!chatId) return [];
    const chatMessagesData = state.messages.messagesData[chatId];
    if (!chatMessagesData) return [];
    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      // showing all messages on chatscreen
      messageList.push({
        key,
        ...message,
      });
    }

    return messageList;
  });

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

  useEffect(() => {
    if (params.languageTo) {
      setLanguageTo(params.languageTo);
    }
    if (params.languageFrom) {
      setLanguageFrom(params.languageFrom);
    }
    console.log("params.languageTo", params.languageTo);
  }, [params.languageTo, params.languageFrom]);
  // user ids from selecting a user to chat with
  const chatData =
    (chatId && storedChats[chatId]) || props.route?.params?.newChatData || {};
  // chat data is an object with an array inside

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];

    if (otherUserData) {
      const { firstName, lastName } = otherUserData;
      if (firstName || lastName) {
        // Construct the chat title using firstName and lastName, or firstLast if either is missing
        return otherUserData.onlineStatus === "Online"
          ? `${firstName} ${lastName} `
          : `${firstName} ${lastName}`;
      } else {
        // If there is no firstName or lastName, use the firstLast
        return otherUserData.firstLast &&
          otherUserData.onlineStatus === "Online"
          ? `${otherUserData.firstLast} `
          : `${otherUserData.firstLast}`;
      }
    }

    return ""; // Return an empty string if otherUserData is not available
  };

  //TODO: SPEECH TO TEXT
  let [started, setStarted] = useState(false);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const onSpeechResults = (result) => {
    setMessageText(result.value[0]);
  };

  const onSpeechError = (error) => {
    console.log("Error", error);
  };

  const stopSpeechToText = async () => {
    await Voice.stop(`${userData.languageFrom}-US`);
    setStarted(false);
  };

  //! end of speech to text

  useEffect(() => {
    if (!chatData) return;
    // hides header if user is not subscribed
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    // get the first and last name of the otherUserId
    const otherUserData = storedUsers[otherUserId];

    props.navigation.setOptions({
      headerTitle: chatData.chatName ?? getChatTitleFromName() ?? otherUserData,
      headerTitleStyle: {
        fontFamily: "semiBold",
        fontSize: 17,
      },

      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          {chatId && (
            <TouchableOpacity onPress={() => props.navigation.navigate("info")}>
              <Feather name="info" size={24} color="grey" />
            </TouchableOpacity>
          )}
        </HeaderButtons>
      ),
    });

    // chat data is the user id of the person we are chatting with
    setChatUsers(chatData.users);
  }, [chatUsers]);
  // Allows for use of one translation if person uses the preview button.  if first use of preview button, then it will send that las translation from the preview
  //:TODO when user click preview it saves that translation to state so unless they change the text"will need to press preview again"" it will use that translation

  //! below code updates the correct message no matter what.

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    setMessageText("");
    stopSpeechToText();

    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers?.[otherUserId];
    const blockedByCurrentUser = userData?.blockedByUsers?.[otherUserId];

    if (blockedByCurrentUser) {
      Alert.alert("Blocked", `You have been blocked by this user.`);
      setIsLoading(false);
      return;
    }

    try {
      let id = chatId;
      if (!id) {
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }
      const from = languageFrom;
      const to = languageTo;

      setIsLoading(false);

      const translationPromise = userData.romanized
        ? getCachedTranslation(messageText, from, to)
        : getCachedNonRomanizedTranslation(messageText, from, to);

      const [translationResult] = await Promise.all([
        translationPromise,
        sendTextMessage(
          id,
          userData,
          messageText,
          "",
          "",
          "",
          replyingTo && replyingTo.key,
          chatUsers
        ),
      ]);

      const translation = userData.romanized
        ? translationResult || "Translation unavailable"
        : translationResult?.translated_text?.[to] || "Translation unavailable";
      const messageIds = await getLatestMessageIds(id);

      for (const messageId of messageIds) {
        const message = await getMessageById(id, messageId);
        console.log("message", message);
        if (
          message.text === messageText &&
          message.sentBy === userData.userId
        ) {
          await updateMessageTranslation(
            id,
            messageId,
            translation,
            from,
            to,
            messageText
          );

          if (userData.romanized) {
            cacheTranslation(messageText, from, to);
          } else {
            cacheNonRomanizedTranslation(messageText, from, to);
          }

          break; // Stop searching once the message is found and updated
        }
      }
    } catch (error) {
      console.log("Error", error);
      setErrorBannerText("Error sending message");
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }

    setReplyingTo(null);
  }, [
    messageText,
    languageFrom,
    languageTo,
    chatId,
    userData,
    props.route.params.newChatData,
    replyingTo,
    chatUsers,
  ]);

  console.log("params.newchatdata", props.route.params.newChatData);

  async function getCachedTranslation(text, from, to) {
    const cacheKey = `${text}-${from}-${to}`;

    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    const translationResultPromise = translateTextMessage(text, from, to);
    translationCache.set(cacheKey, translationResultPromise);

    if (translationCache.size > MAX_CACHE_SIZE) {
      const oldestCacheKey = translationCache.keys().next().value;
      translationCache.delete(oldestCacheKey);
    }

    return translationResultPromise;
  }

  async function cacheTranslation(text, from, to) {
    const cacheKey = `${text}-${from}-${to}`;
    if (!translationCache.has(cacheKey)) {
      const translationResultPromise = translateTextMessage(text, from, to);
      translationCache.set(cacheKey, translationResultPromise);

      if (translationCache.size > MAX_CACHE_SIZE) {
        const oldestCacheKey = translationCache.keys().next().value;
        translationCache.delete(oldestCacheKey);
      }

      await translationResultPromise;
    }
  }
  // Define getCachedNonRomanizedTranslation and cacheNonRomanizedTranslation functions similarly to getCachedTranslation and cacheTranslation
  // Define getCachedNonRomanizedTranslation function
  async function getCachedNonRomanizedTranslation(text, from, to) {
    const cacheKey = `${text}-${from}-${to}-nonromanized`; // Adjust the cache key to differentiate from romanized translations

    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    const translationResultPromise = translateTextMessageNonRoman(
      text,
      from,
      to
    );
    translationCache.set(cacheKey, translationResultPromise);

    if (translationCache.size > MAX_CACHE_SIZE) {
      const oldestCacheKey = translationCache.keys().next().value;
      translationCache.delete(oldestCacheKey);
    }

    return translationResultPromise;
  }

  // Define cacheNonRomanizedTranslation function
  async function cacheNonRomanizedTranslation(text, from, to) {
    const cacheKey = `${text}-${from}-${to}-nonromanized`; // Adjust the cache key to differentiate from romanized translations
    if (!translationCache.has(cacheKey)) {
      const translationResultPromise = translateTextMessageNonRoman(
        text,
        from,
        to
      );
      translationCache.set(cacheKey, translationResultPromise);

      if (translationCache.size > MAX_CACHE_SIZE) {
        const oldestCacheKey = translationCache.keys().next().value;
        translationCache.delete(oldestCacheKey);
      }

      await translationResultPromise;
    }
  }

  const previewMessage = useCallback(async () => {
    try {
      setIsLoadingPreview(true);

      if (!messageText) {
        setTranslation(translation);
        setIsLoadingPreview(false);
        setIsLoading(false);
        Alert.alert("Preview", translation);
        setTimeout(() => {
          setTranslation("");
        }, 8000);
      } else {
        // Translation not found in cache, perform translation
        if (userData.romanized) {
          const result = await translateTextMessage(
            messageText,
            languageFrom,
            languageTo
          );
          if (!result) {
            setTranslation("No result found");
            setIsLoadingPreview(false);
            setIsLoading(false);
            return;
          }

          const translation = result;
          setTranslation(translation);
          setIsLoadingPreview(false);
          setIsLoading(false);
          Alert.alert("Preview", translation);

          setTimeout(() => {
            setTranslation("");
          }, 8000);
        } else {
          const result = await translateTextMessageNonRoman(
            messageText,
            languageFrom,
            languageTo
          );

          if (!result) {
            setTranslation("No result found");
            setIsLoadingPreview(false);
            setIsLoading(false);
            return;
          }

          const translation = result.translated_text[result.to];
          setTranslation(translation);
          setIsLoadingPreview(false);
          setIsLoading(false);
          Alert.alert("Preview", translation);

          setTimeout(() => {
            setTranslation("");
          }, 8000);
        }
      }
    } catch (error) {
      console.log("Error preview message", error);
      setErrorBannerText("Error preview message");
      setIsLoadingPreview(false);
      setIsLoading(false);
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }
  });

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </HeaderButtons>
        );
      },
    });
  }, []);

  //? IMAGE PICKER from chat screen
  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setTempImageUri(tempUri);
    } catch (error) {
      console.log("Error picking image", error);
      setErrorBannerText("Error picking image");
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }
  }, [tempImageUri]);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);
    try {
      let id = chatId;
      if (!id) {
        // No chat Id. Create the chat
        id = await createChat(
          userData.userId,
          props.route.params.newChatData,
          true
        );
        setChatId(id);
      }
      // !sending photo as a text
      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      setIsLoading(false);
      const imageUrl = uploadUrl;
      if (!imageUrl) return;
      await sendImage(
        id,
        userData,
        imageUrl,
        replyingTo && replyingTo.key,
        chatUsers
      );

      setReplyingTo(null);
      setTimeout(() => setTempImageUri(""), 500);
    } catch (error) {
      console.log("Error uploading image", error);
      setErrorBannerText("Error uploading image");
      setIsLoading(false);
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }
  }, [isLoading, tempImageUri, chatId]);

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if (!tempUri) return;
      setTempImageUri(tempUri);
    } catch (error) {
      console.log("Error picking image", error);
      setErrorBannerText("Error picking image");
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }
  }, [tempImageUri]);
  // typing indicator code:
  const [isTyping, setIsTyping] = useState(false);

  const typingStatusRef = ref(
    getDatabase(),
    `chatUsers/${chatId}/${userData.userId}/isTyping`
  );

  useEffect(() => {
    const app = getFirebase();
    const db = getDatabase(app);
    const typingStatusRef = ref(db, `chatUsers/${chatId}`);

    const onTypingStatusChange = (snapshot) => {
      const usersTyping = snapshot.val() || {};
      const otherUsersTyping = Object.keys(usersTyping).filter(
        (userId) => userId !== userData.userId && usersTyping[userId].isTyping
      );
      setIsTyping(otherUsersTyping.length > 0);
    };

    onValue(typingStatusRef, onTypingStatusChange);

    return () => {
      off(typingStatusRef, onTypingStatusChange);
      // Set the typing status to false when the component is unmounted
      set(typingStatusRef, false);
    };
  }, [chatId, userData.userId]);

  useEffect(() => {
    if (messageText.length > 0) {
      handleTextInputStart();
    } else {
      handleTextInputEnd();
    }
  }, [messageText]);

  const handleTextInputStart = () => {
    // Update the typing status to true when the user starts typing
    set(typingStatusRef, true);
  };

  const handleTextInputEnd = () => {
    // Update the typing status to false when the user stops typing
    set(typingStatusRef, false);
  };

  if (paywallShown && activeSubscriptions.length === 0) {
    return (
      <PageContainer>
        <PaymentScreen setTrue={() => setPaywallShown(true)} />
      </PageContainer>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 95 : { height: 100 }}
      >
        <ImageBackground style={styles.image} source={backgroundImage}>
          <BubblePageContainer style={{ backgroundColor: "transparent" }}>
            {errorBannerText !== "" && (
              <Bubble
                text={errorBannerText}
                type="error "
                style={styles.errorBanner}
              />
            )}

            {!chatId && (
              <PageContainer>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={
                      Platform.OS === "ios" ? 95 : { height: 100 }
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        marginTop: "22%",
                        paddingHorizontal: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 28,
                          textAlign: "center",
                          color: "#333",
                          marginBottom: 20,
                          paddingBottom: 50,
                        }}
                      >
                        Giddy up! Say{" "}
                        <Text style={{ color: "black", fontWeight: "bold" }}>
                          Hi! 👋
                        </Text>{" "}
                      </Text>

                      <TouchableOpacity
                        onPress={() => setMessageText("Hello, how are you?")}
                        style={{
                          backgroundColor: "orange",
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 10,
                          marginBottom: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          Hello, how are you?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setMessageText("Hey, what's up?")}
                        style={{
                          backgroundColor: "orange",
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 10,
                          marginBottom: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          Hey, what's up?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setMessageText("Nice to meet you!")}
                        style={{
                          backgroundColor: "orange",
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 10,
                          marginBottom: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          Nice to meet you!
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setMessageText("How's your day going?")}
                        style={{
                          backgroundColor: "orange",
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          How's your day going?
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          bottom: 0,
                          left: 0,
                          right: 0,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ marginTop: 40, fontFamily: "semiBold" }}>
                          Tips:
                        </Text>
                        <Text style={{ marginTop: 20, fontFamily: "regular" }}>
                          -Tap the top of messages to create flashcards.
                        </Text>
                        <Text style={{ marginTop: 5, fontFamily: "regular" }}>
                          -Tap translation to hear pronunciation.
                        </Text>
                        {/* <Text style={{ marginTop: 5, fontFamily: "regular" }}>
                          -Long press buttons for explanations.
                        </Text> */}
                        <Image
                          style={{
                            width: 35,
                            height: 35,
                            // resizeMode: "contain",
                            // marginRight: 10,
                          }}
                          source={require("../../assets/images/preview.png")}
                        />
                        <Text
                          style={{
                            marginTop: 5,
                            fontFamily: "regular",
                            paddingHorizontal: 20,
                          }}
                        >
                          -Give the preview button a try when it appears
                          (featured above); it's especially useful for writing
                          in your target language.
                        </Text>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </ScrollView>
              </PageContainer>
            )}

            {chatId && (
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, width: "100%" }}
                contentContainerStyle={{ flexGrow: 1 }}
                ref={(ref) => (flatList.current = ref)}
                onContentSizeChange={() =>
                  chatMessages.length > 0 &&
                  flatList.current.scrollToEnd({ animated: false })
                }
                onLayout={() =>
                  chatMessages.length > 0 &&
                  flatList.current.scrollToEnd({ animated: false })
                }
                // Call the loadMoreMessages function when reaching the beginning of the list
                // onEndReached={loadMessagesMore}
                // onEndReachedThreshold={0.5} // Define the threshold at which the onEndReached event should be triggered
                data={chatMessages}
                keyExtractor={(item) => item.key}
                renderItem={(itemData) => {
                  const message = itemData.item;
                  const isOwnMessage = message.sentBy === userData.userId;
                  let messageType;
                  if (message.type && message.type === "info") {
                    messageType = "info";
                  } else if (isOwnMessage) {
                    messageType = "myMessage";
                  } else {
                    messageType = "theirMessage";
                  }

                  const sender = message.sentBy && storedUsers[message.sentBy];
                  const name =
                    sender && `${sender.firstName} ${sender.lastName}`;
                  const image = sender && sender.profilePic;
                  return (
                    <View style={styles.bubbleContainer}>
                      <View style={styles.nameContainer}>
                        {!isOwnMessage && (
                          <View>
                            {image ? (
                              <TouchableOpacity
                                onPress={() =>
                                  chatData.isGroupChat
                                    ? props.navigation.navigate(
                                        "GroupChatSettings",
                                        { chatId }
                                      )
                                    : props.navigation.navigate("ContactPage", {
                                        uid: chatUsers.find(
                                          (uid) => uid !== userData.userId
                                        ),
                                      })
                                }
                              >
                                <MainProfilePic uri={image} size={33} />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  chatData.isGroupChat
                                    ? props.navigation.navigate(
                                        "GroupChatSettings",
                                        { chatId }
                                      )
                                    : props.navigation.navigate("ContactPage", {
                                        uid: chatUsers.find(
                                          (uid) => uid !== userData.userId
                                        ),
                                      })
                                }
                              >
                                <ImageSettingsHelper size={33} uri={image} />
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </View>

                      {!chatData.isGroupChat || isOwnMessage ? null : (
                        <Text style={styles.name}>{name}</Text>
                      )}

                      <Bubble
                        textOnly={textOnly}
                        isGroupChat={chatData.isGroupChat}
                        type={messageType}
                        text={message.text}
                        translation={message.translation}
                        messageId={message.key}
                        userId={userData.userId}
                        userLanguageTwo={userData.languageTwo}
                        userLanguage={userData.language}
                        userLanguageFrom={userData.languageFrom}
                        fromM={message.from}
                        toM={message.to}
                        chatId={chatId}
                        time={moment(message.sentAt).format("LT")}
                        setReply={() => {
                          setReplyingTo(message);
                        }}
                        replyingTo={
                          message.replyTo &&
                          chatMessages.find((i) => i.key === message.replyTo)
                        }
                        imageUrl={message.imageUrl}
                      />
                    </View>
                  );
                }}
              />
            )}

            {replyingTo && (
              <ReplyTo
                text={replyingTo.text}
                user={storedUsers[replyingTo.sentBy]}
                onCancel={() => {
                  setReplyingTo(null);
                }}
              />
            )}
            {isTyping && chatId && (
              <View style={styles.typingIndicator}>
                <Image
                  source={require("../../assets/images/typingIndicator.gif")}
                  style={{
                    width: 60,
                    height: 50,
                    bottom: 0,
                    left: 10,
                  }}
                />
              </View>
            )}
          </BubblePageContainer>
        </ImageBackground>
        <View
          style={{
            ...styles.inputContainer,
            height: Math.max(44, height + 14),
            maxHeight: 224,
          }}
          onContentSizeChange={(event) => {
            setHeight(event.nativeEvent.contentSize.height);
          }}
        >
          {messageText === "" && (
            <>
              <TouchableOpacity
                style={styles.globeButton}
                hitSlop={{ top: 20, bottom: 20, left: 100, right: 30 }}
                onLongPress={() =>
                  Alert.alert(
                    "Type in any language you want and translate to your native language. then press the preview button to see the translation before sending."
                  )
                }
                disabled={!chatId}
                onPress={() =>
                  props.navigation.navigate("languageSelectM", {
                    title: "Translate To",
                    selected: languageTo,
                    mode: "to",
                  })
                }
              >
                <Image
                  style={{
                    width: 25,
                    height: 25,
                  }}
                  source={require("../../assets/images/trans.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.globeButton}
                onPress={pickImage}
                onLongPress={() => Alert.alert("Uploads a photo.")}
              >
                <Feather name="image" size={27} color="black" />
              </TouchableOpacity>
            </>
          )}
          {messageText !== "" && (
            <TouchableOpacity
              style={styles.globeButton}
              hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
              onLongPress={() =>
                Alert.alert(
                  "Preview",
                  "Ensure accuracy in your target language by previewing the translation in your native language. See help page for more info in settings"
                )
              }
              onPress={previewMessage}
              disabled={isLoadingPreview}
            >
              {isLoadingPreview ? (
                <ActivityIndicator size={27} color="grey" />
              ) : (
                <MaterialIcons name="preview" size={27} color="black" />
              )}
            </TouchableOpacity>
          )}
          <View style={styles.textBoxContainer}>
            <TextInput
              value={messageText}
              onChangeText={(text) => setMessageText(text)}
              contentEditable={true}
              onFocus={handleTextInputStart}
              onBlur={handleTextInputEnd}
              style={
                messageText === ""
                  ? styles.textBox
                  : {
                      ...styles.textBox,
                      maxHeight: 211,
                    }
              }
              autoCorrect={true}
              autoCapitalize="sentences"
              placeholder={`Translate to ${
                (languageTo === "af" && "Afrikaans") ||
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
                (languageTo === "zu" && "Zulu")
              }`}
              placeholderTextColor="grey"
              onContentSizeChange={(event) => {
                setHeight(event.nativeEvent.contentSize.height);
              }}
              scrollEnabled
              multiline
              maxLength={170}
            />
          </View>

          {messageText.length === 0 ? (
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 10, right: 50 }}
              onPress={takePhoto}
              style={styles.globeButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size={26} color={colors.grey} />
              ) : (
                <Feather
                  name="camera"
                  size={26}
                  color={isLoading ? colors.grey : colors.black}
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 10, right: 50 }}
              onPress={onSubmit}
              style={styles.globeButton}
              disabled={
                isLoading ||
                messageText === "" ||
                messageText == " " ||
                messageText == "  " ||
                messageText == "   "
              }
            >
              {isLoading ? (
                <MaterialCommunityIcons
                  name="send"
                  size={26}
                  color={colors.grey}
                  style={{
                    transform: [{ rotate: "0deg" }],
                    opacity: 0.8,
                  }}
                />
              ) : (
                <Image
                  style={{
                    width: 26,
                    height: 26,
                    transform: [{ rotate: "44deg" }],
                  }}
                  source={require("../../assets/images/send-message.png")}
                />
              )}
            </TouchableOpacity>
          )}
          <AwesomeAlert
            show={tempImageUri !== ""}
            showProgress={false}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Cancel"
            confirmText="Send image"
            confirmButtonColor={colors.orange}
            cancelButtonColor={colors.grey}
            titleStyle={styles.popupTitleStyle}
            onCancelPressed={() => {
              setTempImageUri("");
            }}
            onConfirmPressed={() => {
              //! put tempImageUri in later chang if buggy
              uploadImage();

              setTempImageUri("");
            }}
            customView={
              <View>
                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={{ marginTop: 20 }}
                  />
                )}
                {!isLoading && tempImageUri !== "" && (
                  <Image
                    source={{ uri: tempImageUri }}
                    style={styles.uploadImage}
                  />
                )}
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.isPad && 170,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  containe2: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },

  bubbleContainer: {
    flex: 1,
    // paddingHorizontal: Platform.isPad && 170,
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 8,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    // position: "absolute",
    left: 0,
    top: 0,
    // width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  image2: {
    flex: 2,
    resizeMode: "contain",
    width: "71%",
    height: "71%",
  },

  errorBanner: {
    backgroundColor: "red",
  },
  popupTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.orange,
  },
  uploadImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    padding: 10,
    resizeMode: "contain",
  },
  imageText: {
    marginLeft: 10,
    color: colors.orange,
  },
  name: {
    fontFamily: "regular",
    color: colors.grey,
    position: "absolute",
    top: -5,
    left: 35,
    fontSize: 12,
  },
  bubblelast: {
    marginBottom: 10,
  },
  trigger: {
    width: 20,
    height: 20,
    fontSize: 20,
    color: colors.defaultTextColor,
    fontFamily: "regular",
  },
  inputContainer: {
    flexDirection: "row",
    paddingTop: 3,
    paddingVertical: 5,
    paddingHorizontal: 13,
    alignItems: "flex-end",
    backgroundColor: "white",
  },
  textBox: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    borderRadius: 16,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    fontSize: 17,
    borderWidth: 3,
    borderColor: "#F4F4F4",
    color: colors.defaultTextColor,
    textAlignVertical: "top",
  },
  globeButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  textBoxContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
