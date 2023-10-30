import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import colors from "../constants/colors";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import { AntDesign } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";
import { createPhraseCard } from "../utils/actions/phraseActions";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import ImageModal from "./ImageModal";
import { useState } from "react";
import { Image } from "expo-image";
import { getFirebase } from "../utils/firebaseHelper";
import {
  child,
  getDatabase,
  push,
  ref,
  set,
  off,
  onValue,
  update,
  get,
  remove,
} from "firebase/database";

const MenuItem = (props) => {
  const Icon = props.icon ?? Feather;

  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{props.text}</Text>
        <Icon name={props.iconName} size={26} color={colors.defaultTextColor} />
      </View>
    </MenuOption>
  );
};

const Bubble = (props) => {
  const {
    name,
    date,
    text,
    translation,
    type,
    time,
    fromM,
    toM,
    chatId,
    setReply,
    replyingTo,
    imageUrl,
    userLanguageFrom,
    messageId,
  } = props;

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const [hearted, setHearted] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const userId = userData.userId;
  const to = userData.language;

  const [modalVisible, setModalVisible] = React.useState(false);

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const heartStyle = { ...styles.heart };
  const translationStyle = { ...styles.textTranslation };
  const wrapperStyle = { ...styles.wrapperStyle };
  const timeContainerStyle = { ...styles.timeContainer };
  const menuStyle = { ...styles.menuStyle };
  const bubblepreWrapper = { ...styles.bubblepreWrapper };
  const imageStyle = { ...styles.image };
  const timeStyle = { ...styles.time };
  const menuRef = React.useRef(null);
  const id = React.useRef(uuid.v4());
  let Container = View;
  const dateString = date && moment(date).format("LT");

  const handleImagePress = () => {
    setModalVisible(true);
  };

  switch (type) {
    case "system":
      textStyle.backgroundColor = colors.white;
      translationStyle.backgroundColor = colors.white;
      bubbleStyle.backgroundColor = colors.white;
      bubbleStyle.alignItems = "flex-start";
      bubbleStyle.marginTop = 5;
      break;
    case "error":
      textStyle.color = colors.red;
      textStyle.backgroundColor = colors.white;
      translationStyle.backgroundColor = colors.white;
      bubbleStyle.backgroundColor = colors.white;
      bubbleStyle.alignItems = "flex-start";
      bubbleStyle.marginTop = 5;
      break;
    case "myMessage":
      textStyle.color = colors.white;
      translationStyle.color = colors.defaultTextColor;
      translationStyle.paddingTop = 1;
      heartStyle.color = "darkred";
      heartStyle.position = "absolute";
      heartStyle.left = -20;
      heartStyle.top = -10;
      wrapperStyle.justifyContent = "flex-end";
      bubblepreWrapper.marginTop = -10;
      bubbleStyle.alignSelf = "flex-end";
      bubbleStyle.backgroundColor = userData.darkMode
        ? "dodgerblue"
        : colors.orange;
      bubbleStyle.maxWidth = "90%";
      bubbleStyle.maxHeight = "100%";
      bubbleStyle.borderBottomEndRadius = 0;
      bubbleStyle.marginRight = 0;
      Container = TouchableWithoutFeedback;
      imageStyle.borderRadius = 11;
      imageStyle.width = 275;
      imageStyle.height = 275;
      imageStyle.marginTop = 5;
      imageStyle.marginBottom = 10;
      imageStyle.marginRight = 5;
      imageStyle.flex = 1;
      imageStyle.borderBottomEndRadius = 0;
      timeContainerStyle.justifyContent = "flex-end";
      timeContainerStyle.marginRight = 0;
      timeContainerStyle.marginTop = -10;
      timeContainerStyle.marginBottom = 5;
      break;
    case "theirMessage":
      timeContainerStyle.justifyContent = "flex-start";
      timeContainerStyle.marginLeft = 5;
      heartStyle.color = "darkred";
      heartStyle.position = "absolute";
      heartStyle.right = -20;
      heartStyle.top = -10;
      timeContainerStyle.marginBottom = 5;
      timeContainerStyle.marginTop = -10;
      textStyle.color = colors.defaultTextColor;
      bubbleStyle.maxWidth = "90%";
      bubbleStyle.maxHeight = "100%";
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.alignSelf = "flex-start";
      translationStyle.color = colors.translationBubbleColor;
      translationStyle.paddingTop = 1;
      bubbleStyle.backgroundColor = colors.lightGreyBubble;
      bubbleStyle.borderBottomStartRadius = 0;
      bubbleStyle.marginLeft = 5;
      imageStyle.borderRadius = 11;
      imageStyle.width = 275;
      imageStyle.height = 275;
      imageStyle.marginTop = 5;
      imageStyle.marginBottom = 10;
      imageStyle.marginRight = 25;
      imageStyle.flex = 1;
      imageStyle.borderBottomStartRadius = 0;
      Container = TouchableWithoutFeedback;
      break;
    case "reply":
      timeContainerStyle.marginTop = -40;
      bubbleStyle.maxWidth = "100%";
      bubbleStyle.maxHeight = "100%";
      bubbleStyle.marginLeft = -8;
      imageStyle.borderRadius = 10;
      imageStyle.width = 275;
      imageStyle.height = 275;
      imageStyle.marginTop = 5;
      imageStyle.marginBottom = 10;
      imageStyle.marginRight = 25;
      imageStyle.flex = 1;
      imageStyle.borderBottomStartRadius = 0;

      break;
    case "info":
      bubbleStyle.backgroundColor = colors.white;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 10;
      bubbleStyle.marginLeft = 10;
      textStyle.color = colors.defaultTextColor;
      timeContainerStyle.justifyContent = "flex-end";
      timeContainerStyle.marginRight = 15;
      break;
    default:
      break;
  }
  const copyToClipboard = async () => {
    // copy a part of the text to the clipboard
    await Clipboard.setStringAsync(text);
  };
  // if languageFrom is equal to language and language is equal to languageFrom

  const speak = () => {
    Speech.speak(translation, {
      language: toM,
      pitch: 1,
      rate: 0.7,
    });
  };
  //TODO: add back menu item that calls speakText
  const speakText = () => {
    // console.log("speakText", toM, fromM, to);
    //sense what language the text is written in.

    Speech.speak(text, {
      language: fromM,
      pitch: 1,
      rate: 0.71,
    });
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // // Inside your main component
  // const handleLove = () => {
  //   // Logic to handle the love action
  //   setHearted(!hearted);
  // };

  useEffect(() => {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

    const handleData = (snap) => {
      if (snap.val()) {
        setHearted(snap.val().hearted);
      }
    };
    onValue(messageRef, handleData, {
      onlyOnce: true,
    });

    return () => {
      off(messageRef, handleData);
    };
  }, [hearted, messageId]);

  const handleLove = async () => {
    try {
      // Update the hearted state in the database
      const app = getFirebase();
      const dbRef = ref(getDatabase(app));

      const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);
      console.log("messageRef", messageRef);
      console.log("messageId", messageId);
      const messageSnapshot = await get(messageRef);
      console.log("messageSnapshot", messageSnapshot);
      if (messageSnapshot.exists()) {
        const messageData = messageSnapshot.val();
        const updatedMessageData = {
          ...messageData,
          hearted: !hearted,
        };

        await update(messageRef, updatedMessageData);

        // Update the local hearted state
        setHearted(!hearted);
      } else {
        console.log("Message not found");
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  useEffect(() => {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

    const handleData = (snap) => {
      if (snap.val()) {
        setLiked(snap.val().liked);
      }
    };

    onValue(messageRef, handleData, {
      onlyOnce: true,
    });

    return () => {
      off(messageRef, handleData);
    };
  }, [hearted, messageId]);

  const handleLike = async () => {
    try {
      // Update the liked state in the database
      const app = getFirebase();
      const dbRef = ref(getDatabase(app));

      const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);
      console.log("messageRef", messageRef);
      console.log("messageId", messageId);
      const messageSnapshot = await get(messageRef);
      console.log("messageSnapshot", messageSnapshot);

      if (messageSnapshot.exists()) {
        const messageData = messageSnapshot.val();
        const updatedMessageData = {
          ...messageData,
          liked: !messageData.liked, // Toggle the liked value
        };

        await update(messageRef, updatedMessageData);

        // You can choose to update the local liked state or not,
        // depending on whether you need it for further UI interactions.
        setLiked(!liked);

        console.log("Like updated successfully");
      } else {
        console.log("Message not found");
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  // CREATE AND ADD FLASHCARD TO PHRASEBOOK FUNCTION
  const submitHandler = async () => {
    const id = uuid.v4();
    const result = {
      text,
      translation,
      users: [userId],
    };
    result.id = id;
    if (toM) {
      console.log("toM", toM);
      result.to = toM;
    }
    result.dateTime = new Date().toISOString();
    createPhraseCard(userId, {
      ...result,
    });
    // Alert.alert(`flashcard added :)`);
    Alert.alert(
      "Flashcard added!",
      "Go study or continue chatting?",
      [
        {
          text: "flashcards",
          onPress: () => {
            navigation.navigate("Flashcards");
          },
          style: "cancel",
        },
        {
          text: "chat",
          onPress: () => console.log("Cancel Pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  const [prevMessageTime, setPrevMessageTime] = useState(null);

  const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];

  return (
    <>
      <View style={wrapperStyle}>
        {!imageUrl && (
          <Container
            onLongPress={() =>
              menuRef.current.props.ctx.menuActions.openMenu(id.current)
            }
            style={{ width: "100%", hitSlop: { top: 8 } }}
            onPress={() => {
              submitHandler();
            }}
          >
            <View style={bubblepreWrapper}>
              <View style={bubbleStyle}>
                {name && type !== "info" && (
                  <Text style={styles.name}>{name}</Text>
                )}
                {replyingToUser && (
                  <>
                    <View
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        alignSelf: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          marginBottom: 10,
                          color: colors.defaultTextColor,
                          fontFamily: "medium",
                          fontSize: 18,
                        }}
                      >
                        {`@${replyingToUser.firstName} ${replyingToUser.lastName}`}
                      </Text>
                    </View>
                  </>
                )}

                {hearted && (
                  <View style={heartStyle}>
                    <Text>❤️</Text>
                  </View>
                )}
                {liked && (
                  <View
                    style={{ ...heartStyle, color: colors.defaultTextColor }}
                  >
                    <Text>👍</Text>
                  </View>
                )}
                {!imageUrl && text && <Text style={textStyle}>{text}</Text>}
                {!imageUrl && (
                  <TouchableWithoutFeedback onPress={speak}>
                    <Text style={translationStyle}>{translation}</Text>
                  </TouchableWithoutFeedback>
                )}

                <Menu ref={menuRef} name={id.current}>
                  <MenuTrigger />
                  <MenuOptions>
                    <MenuOption />

                    <MenuItem
                      text="Love"
                      onSelect={handleLove}
                      iconName={"heart"}
                    />
                    <MenuItem
                      text="Like"
                      onSelect={handleLike}
                      iconName={"thumbs-up"}
                    />
                    <MenuItem
                      text="Copy"
                      onSelect={copyToClipboard}
                      iconName={"copy"}
                    />
                    <MenuItem
                      text="Reply"
                      onSelect={setReply}
                      iconName={"arrow-up-left"}
                    />
                  </MenuOptions>
                </Menu>
              </View>
              <View style={timeContainerStyle}>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text style={timeStyle}>{time}</Text>
                </View>
              </View>
            </View>
          </Container>
        )}

        <View
          style={{
            padding: 5,
          }}
        >
          {imageUrl && (
            <View>
              <Container
                onPress={handleImagePress}
                onLongPress={() =>
                  menuRef.current.props.ctx.menuActions.openMenu(id.current)
                }
              >
                <ImageModal
                  // resizeMode="contain"
                  imageBackgroundColor="black"
                  source={{ uri: imageUrl }}
                  imageUrl={imageUrl}
                  style={imageStyle}
                />
              </Container>
              <View style={timeContainerStyle}>
                <Text style={timeStyle}>{time}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default Bubble;
const styles = StyleSheet.create({
  wrapperStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  bubblepreWrapper: {},
  timeContainer: {
    flexDirection: "row",
    marginRight: 10,
    marginTop: 5,
  },
  container: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    minWidth: "35%",
  },
  text: {
    fontSize: 18,
    color: "black",
    fontFamily: "regular",
  },
  textTranslation: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: "regular",
  },
  time: {
    fontSize: 10,
    color: "darkgrey",
    fontFamily: "regular",
  },
  menuItemContainer: {
    paddingHorizontal: 35,
    left: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    flex: 2 / 3,
    color: colors.translationBubbleColor,
    fontSize: 15,
    fontFamily: "semiBold",
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    color: colors.defaultTextColor,
    fontFamily: "regular",
    marginBottom: 5,
  },

  imageStyle: {
    width: 200,
    height: 300,
    marginTop: 5,
    marginRight: 25,
    flex: 1,
  },
  iconContainer: {
    width: 32, // Adjust as needed
    height: 32, // Adjust as needed
    backgroundColor: "blue",
    borderRadius: 16, // Half of the width/height for a circular shape
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Adjust as needed
  },
});
