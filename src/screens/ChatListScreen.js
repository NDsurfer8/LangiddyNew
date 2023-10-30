import * as Notifications from "expo-notifications";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  FlatList,
  TextInput,
  Alert,
  Image,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DataItemDelete from "../../components/DataItemDelete";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import colors from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

import {
  clickedChatWhereNotSender,
  deleteChat,
  sendInfoMessage,
} from "../../utils/actions/chatActions";
import Welcome from "../../assets/images/welcome.png";
import LanguageSelect from "../../assets/images/LanguageSelect.png";
import CachedImage from "react-native-expo-cached-image";
import { useDispatch } from "react-redux";
import { setChatsData } from "../../store/chatSlice";
import Purchases from "react-native-purchases";

import getUserData, {
  searchUsersLanguage,
} from "../../utils/actions/userActions";
import { setStoredUsers } from "../../store/userSlice";

const adUnitId = "ca-app-pub-7278635770152409/2115137577";

const ChatListScreen = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const selectedUser = props.route?.params?.selectedUserId;
  const selectedUserList = props.route?.params?.selectedUsers;
  const chatName = props.route?.params?.chatName;
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [receiverHasRead, setReceiverHasRead] = useState(
    props.route?.params?.receiverHasRead || false
  );

  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;

    return Object.values(chatsData).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

  const dispatch = useDispatch();

  // if a logged in user receives a message, the chat set blue dot will appear

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

  //TODO:  get all users and filter by language like langs useEffect below
  const [allUsers, setAllUsers] = useState([]);
  const [langs, setLangs] = useState([]);

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

  useEffect(() => {
    //TODO: filter users by language connect people randomly learning the same language
    //? could also just get rid of filter and people can just connect with somone learning any language
    dispatch(
      // setStoredUsers({
      //   newUsers: langs.filter(
      //     (user) =>
      //       user.userId !== userData.userId &&
      //       user.language === userData.language &&
      //       user.languageFrom === userData.languageFrom
      //   ),
      // })
      setStoredUsers({
        newUsers: langs,
      })
    );
  }, [langs, dispatch]);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 1) {
      return;
    }
    setSearchTerm(searchTerm);
  }, [searchTerm]);

  // navigating to  chatScreen if a user is selected
  useEffect(() => {
    if (!selectedUser && !selectedUserList) {
      return;
    }

    let chatData;
    let navigationProps;

    if (selectedUser) {
      chatData = userChats.find(
        (chat) => !chat.isGroupChat && chat.users.includes(selectedUser)
      );
    }
    if (chatData) {
      navigationProps = {
        chatId: chatData.key,
      };
    } else {
      const chatUsers = selectedUserList || [selectedUser];
      //  checking if the user is already in the chat users list
      if (!chatUsers.includes(userData.userId)) {
        chatUsers.push(userData.userId);
      }
      // getting the chat id from the chats data
      navigationProps = {
        newChatData: {
          users: chatUsers,
          isGroupChat: selectedUserList !== undefined,
        },
      };
    }
    if (chatName) {
      navigationProps.newChatData.chatName = chatName;
    }
    // navigating to the chat screen with newChatData
    props.navigation.navigate("Chat", navigationProps);
    // clearing the selected user from the navigation params
  }, [props.route?.params, chatName]);
  // put the userChats in the dependency array to make sure the useEffect runs when the userChats change
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return (
    <PageContainer>
      <View style={styles.containerTop}>
        <PageTitle title="Chats" />
        <View style={styles.groupContainer}>
          <TouchableOpacity
            onLongPress={() => {
              Alert.alert(
                "Giddy up!",
                "Roll the dice and connect with someone from around the world for a spontaneous chat.",
                [
                  {
                    text: "Got it",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            }}
            onPress={async () => {
              if (!userData.language || !userData.languageFrom) {
                Alert.alert("Please select your languages in settings");
              } else {
                // get users from the database and store them in an array
                const storedUsersArray = Object.values(storedUsers);

                // filtering out the current user from the stored users array
                const filteredStoredUsers = storedUsersArray.filter(
                  (user) =>
                    (user.userId !== userData.userId &&
                      !user.hidden &&
                      user.onlineStatus === "Online") ||
                    user.isOnline
                );

                // Shuffle the filtered users array using Fisher-Yates shuffle
                const shuffledUsers = shuffleArray(filteredStoredUsers);

                // Check if there are no more users left

                // getting a random user from the shuffled users array
                const randomUser = shuffledUsers[0]; // Select the first user after shuffling

                if (!randomUser) {
                  // Alert.alert("Error: Could not find a random user.");
                  // return;
                  props.navigation.navigate("NewChat", { isGroupChat: false });
                  return;
                }
                // also check to see if there is a chat with the random user already
                const chatData = userChats.find(
                  (chat) =>
                    !chat.isGroupChat && chat.users.includes(randomUser.userId)
                );

                if (chatData) {
                  props.navigation.navigate("Chat", {
                    chatId: chatData.key,
                  });
                  return;
                }
                // search for a specific user

                // navigating to the chat screen with the random user
                props.navigation.navigate("Chat", {
                  newChatData: {
                    users: [randomUser.userId, userData.userId],
                    // specific user and current user
                    // users: ["XF5VLdZ4AWWSuSkjDaNKyofol7h2", userData.userId],
                  },
                });
              }
            }}
          >
            <MaterialCommunityIcons
              name="dice-4"
              size={Platform.isPad ? 39 : 24}
              color="orange"
              style={{
                // transform: [{ rotate: "90deg" }],
                marginRight: "6%",
                marginBottom: "1%",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            // hitSlop={{ top: 20, bottom: 50, left: 50, right: 50 }}
            style={styles.groupIcon}
            onLongPress={() => Alert.alert("Create a new group chat")}
            onPress={() => {
              if (!userData.language || !userData.languageFrom) {
                Alert.alert("Please select your languages in settings");
              } else {
                props.navigation.navigate("NewChat", { isGroupChat: true });
              }
            }}
          >
            <MaterialIcons
              name="group-add"
              size={Platform.isPad ? 39 : 29}
              color={colors.orange}
            />
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 50, left: 20, right: 50 }}
            onLongPress={() => Alert.alert("Create a new chat")}
            style={{
              marginBottom: Platform.isPad ? 5 : 2.6,
            }}
            onPress={() => {
              if (!userData.language || !userData.languageFrom) {
                Alert.alert("Please select your languages in settings");
              } else {
                props.navigation.navigate("NewChat");
              }
            }}
          >
            <Entypo
              name="new-message"
              size={Platform.isPad ? 30 : 20}
              color={colors.orange}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* // Todo: add bot data item */}

      {userChats.length === 0 || userChats === undefined || null ? (
        <View style={styles.container}>
          {
            // if user has selected languages show
            userData.language && userData.languageFrom ? (
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    marginBottom: 20,
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  Getting started!
                </Text>
                {/* Explanation */}
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 20,
                    textAlign: "center",
                    paddingHorizontal: 20,
                    color: "#666",
                  }}
                >
                  Transform everyday conversations into a language learning
                  experience! Just chat, tap and learn!
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 20,
                    textAlign: "center",
                    paddingHorizontal: 20,
                    color: "#666",
                  }}
                >
                  Tap below to initiate a conversation with someone!
                </Text>
                {/* Fingerprint Icon */}
                <TouchableOpacity
                  onPress={async () => {
                    if (!userData.language || !userData.languageFrom) {
                      Alert.alert("Please select your languages in settings");
                    } else {
                      // get users from the database and store them in an array
                      const storedUsersArray = Object.values(storedUsers);

                      // filtering out the current user from the stored users array
                      const filteredStoredUsers = storedUsersArray.filter(
                        (user) =>
                          user.userId !== userData.userId &&
                          // and if user is not hidden
                          !user.hidden
                        // and we dont have any chats with the user
                        // !userChats.find(
                        //   (chat) =>
                        //     !chat.isGroupChat && chat.users.includes(user.userId)
                        // )
                      );

                      // Shuffle the filtered users array using Fisher-Yates shuffle
                      const shuffledUsers = shuffleArray(filteredStoredUsers);

                      // Check if there are no more users left

                      // getting a random user from the shuffled users array
                      const randomUser = shuffledUsers[0]; // Select the first user after shuffling

                      if (!randomUser) {
                        // Alert.alert("Error: Could not find a random user.");
                        // return;
                        props.navigation.navigate("NewChat", {
                          isGroupChat: false,
                        });
                        return;
                      }
                      // also check to see if there is a chat with the random user already
                      const chatData = userChats.find(
                        (chat) =>
                          !chat.isGroupChat &&
                          chat.users.includes(randomUser.userId)
                      );

                      if (chatData) {
                        props.navigation.navigate("Chat", {
                          chatId: chatData.key,
                        });
                        return;
                      }
                      // search for a specific user

                      // navigating to the chat screen with the random user
                      props.navigation.navigate("Chat", {
                        newChatData: {
                          users: [randomUser.userId, userData.userId],
                        },
                      });
                    }
                  }}
                >
                  <View
                    style={{
                      // backgroundColor: "#f5f5f5",
                      padding: 10,
                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Ionicons
                      name="finger-print-sharp"
                      size={50}
                      color="orange"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  marginTop: "40%", // Add padding for better aesthetics
                }}
              >
                <Text
                  style={{
                    fontSize: 30, // Increase font size for the title
                    fontWeight: "bold",
                    marginBottom: 20,
                    color: "#333",
                    textAlign: "center", // Center the title
                  }}
                >
                  Welcome to Langiddy!
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 20, // Increase margin for better spacing
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Your username is {userData.username} and can be changed in
                  settings anytime.
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 20, // Increase margin for better spacing
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Get started by setting up your profile and select languages by
                  tapping Here.
                </Text>
                <View
                  style={{
                    backgroundColor: "#f5f5f5", // Light gray background
                    padding: 10,
                    borderRadius: 30,
                    position: "absolute",
                    height: 80,
                    width: 80,
                  }}
                ></View>
                <TouchableOpacity
                  onLongPress={() =>
                    Alert.alert(
                      "Long pressing items will give explanations on how to use that button."
                    )
                  }
                  onPress={() => {
                    props.navigation.navigate("Settings");
                  }}
                  style={{
                    flex: 1,
                    // justifyContent: "center",
                    // alignItems: "center",
                    marginTop: "12%", // Add padding for better aesthetics
                    paddingHorizontal: 20, // Add padding for better aesthetics
                  }}
                >
                  <Ionicons
                    name="finger-print-sharp"
                    size={50}
                    color="orange"
                  />
                  <Entypo
                    name="arrow-long-up"
                    size={24}
                    color="black"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      // transform: [{ rotate: "45deg" }],
                      marginRight: "5%",
                      marginTop: 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )
          }
        </View>
      ) : (
        // Todo: put other userData as a prop
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userChats}
          keyExtractor={(item) => item.key}
          renderItem={(itemData) => {
            const chatData = itemData.item;
            console.log("chatData", chatData);
            const chatId = chatData.key;
            const isGroupChat = chatData.isGroupChat;

            let title = "";
            let subTitle = chatData.latestMessageText || "new message";
            let image = "";

            if (isGroupChat) {
              title = chatData.chatName;
              subTitle = chatData.latestMessageText || "new group chat";
              // sets image from group chat
              image = chatData.chatImage;
            } else {
              const otherUserId = chatData.users.find(
                (uid) => uid !== userData.userId
              );
              const otherUserData = storedUsers[otherUserId];
              if (!otherUserData) {
                return null;
              }
              // Check if firstName and lastName are available, if not use the firstLast
              if (otherUserData.firstName || otherUserData.lastName) {
                title = `${otherUserData.firstName} ${otherUserData.lastName}`;
              } else {
                title = otherUserData.firstLast; // Replace "firstLast" with the actual property name for the firstLast in your data structure
              }
              image = otherUserData.profilePic;
            }
            //TODO: if chech if group chat is being deleted
            const deleteUserChat = () => {
              return () => {
                Alert.alert(
                  "Delete Chat",
                  `Are you sure you want to delete this chat?`,
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        await sendInfoMessage(
                          chatId,
                          userData.userId,
                          `Left chat.`
                        );

                        await deleteChat(userData.userId, chatId);
                        if (userChats.length === 1) {
                          dispatch(setChatsData([]));
                        }
                      },
                    },
                  ]
                );
              };
            };

            // if user receives a new message, show orange dot by changing local state to false

            const showBlueDot =
              chatData.latestMessageText &&
              chatData.updatedBy !== userData.userId &&
              !receiverHasRead;

            const hideBlueDot = async () => {
              setReceiverHasRead(true);
              // set the receiverHasRead to false after 8 minutes
              setTimeout(() => {
                setReceiverHasRead(false);
              }, 480000);
            };
            const otherUserId = chatData.users.find(
              (uid) => uid !== userData.userId
            );
            const otherUserData = storedUsers[otherUserId];
            if (!otherUserData) {
              return null;
            }

            const isOnline = otherUserData.hidden;
            const user = otherUserData.userId;
            console.log("user", user);
            console.log("isOnline", isOnline);
            return (
              <DataItemDelete
                onlineStatus={isOnline}
                showBlueDot={showBlueDot}
                hideBlueDot={hideBlueDot}
                onRefresh={"onRefresh"}
                deleteUserChat={deleteUserChat()}
                title={title}
                subTitle={subTitle}
                image={image}
                onPress={() => {
                  // set the badge count to 0 when the user clicks on the chat
                  Notifications.setBadgeCountAsync(0);
                  clickedChatWhereNotSender(userData.userId, chatId);
                  props.navigation.navigate("Chat", {
                    chatId,
                    image,
                  });
                }}
              />
            );
          }}
        />
      )}
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

export default ChatListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.defaultBackgroundColor,
    // padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  searchBox: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: colors.defaultTextColor,
  },
  newGroupText: {
    color: colors.orange,
    fontSize: 18,
    fontWeight: "regular",

    marginVertical: 10,
  },
  iconsTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  iconsTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  groupContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  groupIcon: {
    marginRight: 26,
  },
  containerTop: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingHorizontal: 10,
  },
  searchBox: {
    flex: 1,
    marginLeft: 10,
    height: 35,
    fontSize: 18,
    color: colors.defaultTextColor,
    backgroundColor: colors.lightGreyBubble,
    borderRadius: 20,
    padding: 10,
    borderBottomEndRadius: 0,
  },
  searchBar: {
    marginLeft: 10,
  },
  image: {
    // width: 350,
    width: Platform.isPad ? 500 : 350,
    // height: 450,
    height: Platform.isPad ? 600 : 450,
    resizeMode: "contain",
    opacity: 0.8,
  },
  image2: {
    // width: 350,
    width: Platform.isPad ? 500 : 350,
    // height: 450,
    height: Platform.isPad ? 600 : 450,
    resizeMode: "contain",
    marginBottom: 40,
    opacity: 0.8,
  },
  text: {
    fontSize: 18,
    color: colors.orange,

    textAlign: "center",
    fontFamily: "regular",
    padding: 5,
    marginBottom: 10,
  },
});
