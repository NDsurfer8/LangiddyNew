import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
  TouchableOpacity,
} from "react-native";
import email from "react-native-email";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../../components/PageContainer";
import ProfileImage from "../../components/ProfileImage";
import PageTitle from "../../components/PageTitle";
import DataItem from "../../components/DataItem";
import { getUserChats } from "../../utils/actions/userActions";
import colors from "../../constants/colors";
import SubmitButton from "../../components/SubmitButton";
import { AntDesign } from "@expo/vector-icons";

import {
  blockUserFromChatting,
  removeUserFromChat,
  unblockUserFromChatting,
  updateChatData,
} from "../../utils/actions/chatActions";
import { ScrollView } from "react-native-gesture-handler";
import MainProfilePic from "../../components/MainProfilePic";
import { MaterialIcons } from "@expo/vector-icons";
import ProfileImageNonCached from "../../components/ProfileImageNonCached";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import * as MailComposer from "expo-mail-composer";
import StarRating from "../../components/StarRating";
import ImageSettingsHelper from "../../components/ImageSettingsHelper";

const ContactScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const currentUser =
    storedUsers[props.route.params.uid] || props.route.params.user;

  const storedChats = useSelector((state) => state.chats.chatsData);
  const [commonChats, setCommonChats] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const chatId = props.route.params.chatId;
  const chatData = chatId && storedChats[chatId];
  const [responseRate, setResponseRate] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setIsAvailable(isMailAvailable);
    }
    checkAvailability();
  }, []);

  useEffect(() => {
    const getCommonUserChats = async () => {
      const currentUserChats = await getUserChats(currentUser.userId);
      setCommonChats(
        Object.values(currentUserChats).filter(
          (cid) => storedChats[cid] && storedChats[cid].isGroupChat
        )
      );
    };
    getCommonUserChats();
  }, []);

  const handleEmail = () => {
    MailComposer.composeAsync({
      subject: "Report user",
      recipients: ["support@langiddy.com"],
      body: `I would like to report this user: ${currentUser.firstName} ${currentUser.lastName} (${currentUser.userId}) for the following reason: `,
    });
  };

  const blockUser = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${currentUser.firstName} ${currentUser.lastName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Block",
          onPress: async () => {
            try {
              setIsLoading(true);
              //block user from chatting
              await blockUserFromChatting(userData, currentUser);
              //remove user from all chats

              setIsLoading(false);
              props.navigation.goBack();
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]
    );
  };
  const UnblockUser = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to Unblock ${currentUser.firstName} ${currentUser.lastName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unblock",
          onPress: async () => {
            try {
              setIsLoading(true);
              //block user from chatting
              await unblockUserFromChatting(userData, currentUser);
              //remove user from all chats

              setIsLoading(false);
              props.navigation.goBack();
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]
    );
  };

  const seeResponseRate = () => {
    // toggle response rate
    setResponseRate(!responseRate);
  };

  const removeFromChat = useCallback(async () => {
    try {
      setIsLoading(true);
      //remove user from chat
      await removeUserFromChat(userData, currentUser, chatData);
      setIsLoading(false);
      props.navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  }, [props.navigation, isLoading]);

  return (
    <PageContainer>
      <ScrollView
        style={{ backgroundColor: "white" }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={["right", "left", "bottom"]}>
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {currentUser.profilePic ? (
                <MainProfilePic
                  uri={currentUser.profilePic}
                  size={200}
                  style={styles.profileImage}
                />
              ) : (
                <ImageSettingsHelper
                  size={200}
                  style={styles.profileImage}
                  userId={currentUser.userId}
                />
              )}

              <Menu>
                <MenuTrigger
                  customStyles={{
                    triggerWrapper: {
                      hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
                      position: "absolute",
                      right: -80,
                      top: 0,
                      backgroundColor: "white",
                      borderRadius: 50,
                      padding: 5,
                      margin: 5,
                    },
                  }}
                >
                  <MaterialIcons name="more-vert" size={26} color="black" />
                </MenuTrigger>
                <MenuOptions
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 5,
                    left: 22,
                    top: -20,
                  }}
                >
                  <MenuOption
                    onSelect={
                      // send an email from the application to the support team withouth opening the email app
                      handleEmail
                    }
                    text="Report inappropriate content"
                  />
                  <MenuOption onSelect={blockUser} text="Block user" />

                  <MenuOption onSelect={UnblockUser} text="Unblock" />
                  {/* <MenuOption onSelect={seeResponseRate} text=" Rate user" /> */}
                </MenuOptions>
              </Menu>
            </View>
            <View style={styles.nameContainer}>
              <PageTitle
                title={`${currentUser.firstName || ""} ${
                  currentUser.lastName || ""
                }${
                  currentUser.firstName || currentUser.lastName
                    ? ""
                    : currentUser.firstLast
                }`}
              />
            </View>
            {chatData && chatData.isGroupChat && (
              <SubmitButton
                title="Remove from group"
                color={colors.orange}
                onPress={removeFromChat}
              />
            )}

            {currentUser && (
              <View>
                <View style={styles.langContainer}>
                  <Text style={styles.about}>
                    {(currentUser.languageFrom === "en" && "English") ||
                      (currentUser.languageFrom === "es" && "Spanish") ||
                      (currentUser.languageFrom === "fr" && "French") ||
                      (currentUser.languageFrom === "de" && "German") ||
                      (currentUser.languageFrom === "it" && "Italian") ||
                      (currentUser.languageFrom === "pt" && "Portuguese") ||
                      (currentUser.languageFrom === "ru" && "Russian") ||
                      (currentUser.languageFrom === "zh-CN" && "Chinese") ||
                      (currentUser.languageFrom === "zh-TW" && "Chinese") ||
                      (currentUser.languageFrom === "ja" && "Japanese") ||
                      (currentUser.languageFrom === "ko" && "Korean") ||
                      (currentUser.languageFrom === "ar" && "Arabic") ||
                      (currentUser.languageFrom === "hi" && "Hindi") ||
                      (currentUser.languageFrom === "bn" && "Bengali") ||
                      (currentUser.languageFrom === "pa" && "Punjabi") ||
                      (currentUser.languageFrom === "ta" && "Tamil") ||
                      (currentUser.languageFrom === "te" && "Telugu") ||
                      (currentUser.languageFrom === "vi" && "Vietnamese") ||
                      (currentUser.languageFrom === "id" && "Indonesian") ||
                      (currentUser.languageFrom === "ms" && "Malay") ||
                      (currentUser.languageFrom === "th" && "Thai") ||
                      (currentUser.languageFrom === "tr" && "Turkish") ||
                      (currentUser.languageFrom === "ur" && "Urdu") ||
                      (currentUser.languageFrom === "nl" && "Dutch") ||
                      (currentUser.languageFrom === "pl" && "Polish") ||
                      (currentUser.languageFrom === "el" && "Greek") ||
                      (currentUser.languageFrom === "hu" && "Hungarian") ||
                      (currentUser.languageFrom === "sv" && "Swedish") ||
                      (currentUser.languageFrom === "da" && "Danish") ||
                      (currentUser.languageFrom === "no" && "Norwegian") ||
                      (currentUser.languageFrom === "fi" && "Finnish") ||
                      (currentUser.languageFrom === "ro" && "Romanian") ||
                      (currentUser.languageFrom === "bg" && "Bulgarian") ||
                      (currentUser.languageFrom === "cs" && "Czech") ||
                      (currentUser.languageFrom === "sk" && "Slovak") ||
                      (currentUser.languageFrom === "sl" && "Slovenian") ||
                      (currentUser.languageFrom === "et" && "Estonian") ||
                      (currentUser.languageFrom === "lv" && "Latvian") ||
                      (currentUser.languageFrom === "lt" && "Lithuanian") ||
                      (currentUser.languageFrom === "af" && "Afrikaans") ||
                      (currentUser.languageFrom === "sq" && "Albanian") ||
                      (currentUser.languageFrom === "am" && "Amharic") ||
                      (currentUser.languageFrom === "hy" && "Armenian") ||
                      (currentUser.languageFrom === "az" && "Azerbaijani") ||
                      (currentUser.languageFrom === "eu" && "Basque") ||
                      (currentUser.languageFrom === "be" && "Belarusian") ||
                      (currentUser.languageFrom === "my" && "Burmese") ||
                      (currentUser.languageFrom === "km" && "Cambodian") ||
                      (currentUser.languageFrom === "ca" && "Catalan") ||
                      (currentUser.languageFrom === "hr" && "Croatian") ||
                      (currentUser.languageFrom === "eo" && "Esperanto") ||
                      (currentUser.languageFrom === "et" && "Estonian") ||
                      (currentUser.languageFrom === "fo" && "Faroese") ||
                      (currentUser.languageFrom === "ka" && "Georgian") ||
                      (currentUser.languageFrom === "gu" && "Gujarati") ||
                      (currentUser.languageFrom === "iw" && "Hebrew") ||
                      (currentUser.languageFrom === "hi" && "Hindi") ||
                      (currentUser.languageFrom === "is" && "Icelandic") ||
                      (currentUser.languageFrom === "jw" && "Javanese") ||
                      (currentUser.languageFrom === "kn" && "Kannada") ||
                      (currentUser.languageFrom === "kk" && "Kazakh") ||
                      (currentUser.languageFrom === "ky" && "Kirghiz") ||
                      (currentUser.languageFrom === "lo" && "Laothian") ||
                      (currentUser.languageFrom === "la" && "Latin") ||
                      (currentUser.languageFrom === "lv" && "Latvian") ||
                      (currentUser.languageFrom === "mk" && "Macedonian") ||
                      (currentUser.languageFrom === "ml" && "Malayalam") ||
                      (currentUser.languageFrom === "mr" && "Marathi") ||
                      (currentUser.languageFrom === "mn" && "Mongolian") ||
                      (currentUser.languageFrom === "ne" && "Nepali") ||
                      (currentUser.languageFrom === "no" && "Norwegian") ||
                      (currentUser.languageFrom === "fa" && "Persian") ||
                      (currentUser.languageFrom === "ps" && "Pashto") ||
                      (currentUser.languageFrom === "si" && "Sinhalese") ||
                      (currentUser.languageFrom === "sw" && "Swahili") ||
                      (currentUser.languageFrom === "tl" && "Tagalog") ||
                      (currentUser.languageFrom === "tg" && "Tajik") ||
                      (currentUser.languageFrom === "ta" && "Tamil") ||
                      (currentUser.languageFrom === "tt" && "Tatar") ||
                      (currentUser.languageFrom === "te" && "Telugu") ||
                      (currentUser.languageFrom === "uz" && "Uzbek") ||
                      (currentUser.languageFrom === "cy" && "Welsh") ||
                      (currentUser.languageFrom === "xh" && "Xhosa") ||
                      (currentUser.languageFrom === "zu" && "Zulu")}
                    {""}
                  </Text>
                  <View style={styles.arrowContainer}>
                    <MaterialIcons
                      name="compare-arrows"
                      size={24}
                      color={colors.burntSienna}
                      style={styles.arrowIcon}
                    />
                  </View>
                  <Text style={styles.about}>
                    {(currentUser.language === "en" && "English") ||
                      (currentUser.language === "es" && "Spanish") ||
                      (currentUser.language === "fr" && "French") ||
                      (currentUser.language === "de" && "German") ||
                      (currentUser.language === "it" && "Italian") ||
                      (currentUser.language === "pt" && "Portuguese") ||
                      (currentUser.language === "ru" && "Russian") ||
                      (currentUser.language === "zh-CN" && "Chinese") ||
                      (currentUser.language === "zh-TW" && "Chinese") ||
                      (currentUser.language === "ja" && "Japanese") ||
                      (currentUser.language === "ko" && "Korean") ||
                      (currentUser.language === "ar" && "Arabic") ||
                      (currentUser.language === "hi" && "Hindi") ||
                      (currentUser.language === "bn" && "Bengali") ||
                      (currentUser.language === "pa" && "Punjabi") ||
                      (currentUser.language === "ta" && "Tamil") ||
                      (currentUser.language === "te" && "Telugu") ||
                      (currentUser.language === "vi" && "Vietnamese") ||
                      (currentUser.language === "id" && "Indonesian") ||
                      (currentUser.language === "ms" && "Malay") ||
                      (currentUser.language === "th" && "Thai") ||
                      (currentUser.language === "tr" && "Turkish") ||
                      (currentUser.language === "ur" && "Urdu") ||
                      (currentUser.language === "nl" && "Dutch") ||
                      (currentUser.language === "pl" && "Polish") ||
                      (currentUser.language === "el" && "Greek") ||
                      (currentUser.language === "hu" && "Hungarian") ||
                      (currentUser.language === "sv" && "Swedish") ||
                      (currentUser.language === "da" && "Danish") ||
                      (currentUser.language === "no" && "Norwegian") ||
                      (currentUser.language === "fi" && "Finnish") ||
                      (currentUser.language === "ro" && "Romanian") ||
                      (currentUser.language === "bg" && "Bulgarian") ||
                      (currentUser.language === "cs" && "Czech") ||
                      (currentUser.language === "sk" && "Slovak") ||
                      (currentUser.language === "sl" && "Slovenian") ||
                      (currentUser.language === "et" && "Estonian") ||
                      (currentUser.language === "lv" && "Latvian") ||
                      (currentUser.language === "lt" && "Lithuanian") ||
                      (currentUser.language === "af" && "Afrikaans") ||
                      (currentUser.language === "sq" && "Albanian") ||
                      (currentUser.language === "am" && "Amharic") ||
                      (currentUser.language === "hy" && "Armenian") ||
                      (currentUser.language === "az" && "Azerbaijani") ||
                      (currentUser.language === "eu" && "Basque") ||
                      (currentUser.language === "be" && "Belarusian") ||
                      (currentUser.language === "my" && "Burmese") ||
                      (currentUser.language === "km" && "Cambodian") ||
                      (currentUser.language === "ca" && "Catalan") ||
                      (currentUser.language === "hr" && "Croatian") ||
                      (currentUser.language === "eo" && "Esperanto") ||
                      (currentUser.language === "et" && "Estonian") ||
                      (currentUser.language === "fo" && "Faroese") ||
                      (currentUser.language === "ka" && "Georgian") ||
                      (currentUser.language === "gu" && "Gujarati") ||
                      (currentUser.language === "iw" && "Hebrew") ||
                      (currentUser.language === "hi" && "Hindi") ||
                      (currentUser.language === "is" && "Icelandic") ||
                      (currentUser.language === "jw" && "Javanese") ||
                      (currentUser.language === "kn" && "Kannada") ||
                      (currentUser.language === "kk" && "Kazakh") ||
                      (currentUser.language === "ky" && "Kirghiz") ||
                      (currentUser.language === "lo" && "Laothian") ||
                      (currentUser.language === "la" && "Latin") ||
                      (currentUser.language === "lv" && "Latvian") ||
                      (currentUser.language === "mk" && "Macedonian") ||
                      (currentUser.language === "ml" && "Malayalam") ||
                      (currentUser.language === "mr" && "Marathi") ||
                      (currentUser.language === "mn" && "Mongolian") ||
                      (currentUser.language === "ne" && "Nepali") ||
                      (currentUser.language === "no" && "Norwegian") ||
                      (currentUser.language === "fa" && "Persian") ||
                      (currentUser.language === "ps" && "Pashto") ||
                      (currentUser.language === "si" && "Sinhalese") ||
                      (currentUser.language === "sw" && "Swahili") ||
                      (currentUser.language === "tl" && "Tagalog") ||
                      (currentUser.language === "tg" && "Tajik") ||
                      (currentUser.language === "ta" && "Tamil") ||
                      (currentUser.language === "tt" && "Tatar") ||
                      (currentUser.language === "te" && "Telugu") ||
                      (currentUser.language === "uz" && "Uzbek") ||
                      (currentUser.language === "cy" && "Welsh") ||
                      (currentUser.language === "xh" && "Xhosa") ||
                      (currentUser.language === "zu" && "Zulu")}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <View style={styles.boxContainer}>
                    <Text style={styles.nextTrip}>About:</Text>

                    {currentUser.about ? (
                      <Text style={styles.nextTripText}>
                        {" "}
                        {currentUser.about}
                      </Text>
                    ) : (
                      <Text style={styles.nextTripText}>
                        {currentUser.firstName
                          ? `${currentUser.firstName} has not added anything yet.`
                          : `${currentUser.username} has not added anything yet.`}
                      </Text>
                    )}
                  </View>
                  <View style={styles.boxContainer}>
                    <Text style={styles.nextTrip}>Availability:</Text>
                    {currentUser.timeChat ? (
                      <Text style={styles.nextTripText}>
                        {currentUser.timeChat}
                      </Text>
                    ) : (
                      <Text style={styles.nextTripText}>
                        {currentUser.firstName
                          ? `I'm open to chat any time. Just say hello, and i'll do my best to respond :)`
                          : `I'm open to chat any time. Just say hello, and i'll do my best to respond :)`}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: -10,
                    }}
                  >
                    {/* {
                      // check to see if the user who clicked on this persons profile has a chat with this person
                      responseRate && (
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              "Response Rating",
                              "1 star - No response\n2 stars - Slow response\n3 stars - Average response\n4 stars - Fast response\n5 stars - Very fast response",
                              [
                                {
                                  text: "Got it!",
                                  onPress: () => console.log("OK Pressed"),
                                },
                              ],
                              { cancelable: false }
                            );
                          }}
                        >
                          <AntDesign
                            name="infocirlceo"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )
                    } */}
                    {/* {
                      // check to see if the user who clicked on this persons profile has a chat with this person
                      responseRate && (
                        <StarRating
                          userId={currentUser.userId}
                          ratingUserId={userData.userId}
                        />
                      )
                    } */}
                  </View>
                </View>
              </View>
            )}
          </View>
          {commonChats.length > 0 && (
            <View>
              <Text
                style={{
                  fontFamily: "bold",
                  color: colors.orange,
                  fontSize: 20,
                }}
              >
                {commonChats.length}{" "}
                {commonChats.length == 1 ? "Group" : "Groups"}
              </Text>
              {commonChats.map((cid) => {
                const chatData = storedChats[cid];
                return (
                  <DataItem
                    key={cid}
                    title={chatData.chatName}
                    subtitle={chatData.latestMessageText}
                    type="link"
                    onPress={() => {
                      props.navigation.push("Chat", { chatId: cid });
                    }}
                    image={chatData.chatImage}
                  />
                );
              })}
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    </PageContainer>
  );
};

export default ContactScreen;
const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
    // justifyContent: "center",
    marginVertical: 10,
  },
  profileInfo: {
    alignItems: "flex-start",
    justifyContent: "center",
  },

  nameContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  about: {
    fontSize: 16,
    color: colors.orange,
    padding: 10,
    textAlign: "center",
    fontFamily: "regular",
  },

  langContainer: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nextTrip: {
    fontSize: 22,
    color: colors.black,
    padding: 10,
    fontFamily: "bold",
  },
  nextTripText: {
    fontSize: 20,
    color: colors.defaultTextColor,
    padding: 10,
    fontFamily: "semiBold",
  },
  boxContainer: {
    // flexDirection: "row",
    justifyContent: "flex-start",
    // alignItems: "flex-start",
    marginVertical: 5,
  },
});
