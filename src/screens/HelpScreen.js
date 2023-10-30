import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Button,
  Alert,
  Linking,
} from "react-native";
import React, { useState } from "react";
import PageContainer from "../../components/PageContainer";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSignedInUserData,
  recentLogin,
  userLogout,
} from "../../utils/actions/authActions";
import { logout } from "../../store/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HelpScreen = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);
  const [showAnswer4, setShowAnswer4] = useState(false);
  const [showAnswer7, setShowAnswer7] = useState(false);
  const [showAnswer44, setShowAnswer44] = useState(false);
  const [showAnswer8, setShowAnswer8] = useState(false);
  const [showAnswer9, setShowAnswer9] = useState(false);
  const [showAnswer10, setShowAnswer10] = useState(false);
  const [showAnswer11, setShowAnswer11] = useState(false);
  const [showAnswerFr, setShowAnswerFr] = useState(false);
  // when the user presses on the question, the answer will show

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  const toggleAnswer2 = () => {
    setShowAnswer2(!showAnswer2);
  };
  const toggleAnswer3 = () => {
    setShowAnswer3(!showAnswer3);
  };
  const toggleAnswer4 = () => {
    setShowAnswer4(!showAnswer4);
  };

  const toggleAnswer7 = () => {
    setShowAnswer7(!showAnswer7);
  };
  const toggleAnswer44 = () => {
    setShowAnswer44(!showAnswer44);
  };
  const toggleAnswer8 = () => {
    setShowAnswer8(!showAnswer8);
  };
  const toggleAnswer9 = () => {
    setShowAnswer9(!showAnswer9);
  };
  const toggleAnswer10 = () => {
    setShowAnswer10(!showAnswer10);
  };
  const toggleAnswer11 = () => {
    setShowAnswer11(!showAnswer11);
  };
  const toggleAnswerFr = () => {
    setShowAnswerFr(!showAnswerFr);
  };

  //if user wants to delete make sure they login again before deletion
  const deleteAccountHandler = async (userId) => {
    if (userData.lastLogin === true) {
      try {
        const result = await deleteSignedInUserData(userId);
        console.log("result", result);
        if (result === true) {
          dispatch(logout());
        }
        if (result === false) {
          Alert.alert("Something went wrong. Please try again later.");
        }
      } catch (err) {
        console.log("err", err);
      }
    } else {
      Alert.alert("Please logout and sign in to delete your account.");
    }
  };
  // made a few adjustments
  const logoutHandler = async (user) => {
    recentLogin(userData.userId);
    dispatch(userLogout(user));
  };

  return (
    <PageContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.container}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "regular",
                  color: "orange",
                  textAlign: "center",
                  margin: 10,
                }}
              >
                Long press on everything in the app to see how to use that
                feature. Tap on the questions below to see the answer.
              </Text>
              <Text></Text>
            </View>

            <TouchableOpacity
              onPress={toggleAnswer}
              onLongPress={() => {
                Alert.alert(
                  "Tap on the question to see the answer below. Tap again to hide the answer."
                );
              }}
            >
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                What do the stars under my username mean?
              </Text>
            </TouchableOpacity>
            {showAnswer && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>

                <Text style={styles.answerText}>
                  The 5 stars under your profile picture represent your
                  responsiveness rating. The more stars you have, people could
                  expect you to be more responsive in a conversation. You can
                  increase your responsiveness rating by responding quickly.
                </Text>
              </>
            )}

            <TouchableOpacity
              onPress={toggleAnswer11}
              onLongPress={() => {
                Alert.alert(
                  "Tap on the question to see the answer below. Tap again to hide the answer."
                );
              }}
            >
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>Having technical issues?</Text>
            </TouchableOpacity>
            {showAnswer11 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>

                <Text style={styles.answerText}>
                  First thing to always do is to make sure you have the latest
                  version of the app installed. If you are still having issues,
                  close the app and restart it. If you are still having issues,
                  delete the app and reinstall it. If you are still having
                  issues, please contact us at support@langiddy.com
                </Text>
              </>
            )}

            <TouchableOpacity
              onPress={toggleAnswer2}
              onLongPress={() => {
                Alert.alert(
                  "Tap on the question to see the answer below. Tap again to hide the answer."
                );
              }}
            >
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                What is the preview feature and how do I use it?
              </Text>
            </TouchableOpacity>
            {showAnswer2 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={require("../../assets/images/preview.png")}
                  />
                  <Image
                    style={{ width: 100, height: 100, resizeMode: "contain" }}
                    source={require("../../assets/images/newPreview.png")}
                  />
                </View>
                <Text style={styles.answerText}>
                  The preview feature lets you review translations before
                  sending. Enter your text, tap the "preview" button (eye icon),
                  and the translation will appear. If satisfied, press "ok" to
                  send; if not, press "ok," make edits, and repeat. The button
                  turns green when successfully pressed
                </Text>
              </>
            )}

            <TouchableOpacity
              onPress={toggleAnswer4}
              onLongPress={() => {
                Alert.alert(
                  "Tap on the question to see the answer below. Tap again to hide the answer."
                );
              }}
            >
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                How can I type in the language I am learning?
              </Text>
            </TouchableOpacity>
            {showAnswer4 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    style={{ width: 100, height: 100, resizeMode: "contain" }}
                    source={require("../../assets/images/trans.png")}
                  />
                </View>
                <Text style={styles.answerText}>
                  To type in the language you're learning, follow these steps:
                  1. Tap the translation button shown above to select your
                  native language. 2. Type your text in your target language. 3.
                  Preview the translation or send the message. You will see the
                  translation in your native language below the text you typed.
                </Text>
                <Text style={styles.answerText}>
                  Here's an example: If you're translating from English to
                  Spanish and want to switch to translating from Spanish to
                  English, follow these steps: 1. Press the "translation" button
                  to select the desired translation language. 2. Enter your text
                  in Spanish. 3. You'll see the translation below in English.
                </Text>
              </>
            )}

            <TouchableOpacity onPress={toggleAnswer7}>
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                Why cant I hear the translation when I tap on it?
              </Text>
            </TouchableOpacity>
            {showAnswer7 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                ></View>
                <Text style={styles.answerText}>
                  Make sure the phone is not on silent and the volume is turned
                  up. If you are still having issues, contact us at
                  support@langiddy.com.
                </Text>
              </>
            )}
            <TouchableOpacity onPress={toggleAnswer8}>
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>How do I use Langs?</Text>
            </TouchableOpacity>
            {showAnswer8 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                ></View>
                <Text style={styles.answerText}>
                  Langs is a feature that allows you to search for people who
                  are fluent in your native language and are also learning your
                  taget language. You can then chat with them in both languages
                  for practice.
                </Text>
                <Text style={styles.answerText}>
                  additionaly, you can use the drop down menu to any language to
                  browse through the list of users who are learning that
                  language.
                </Text>
                <Text style={styles.answerText}>
                  Tap the next button to see another user or press paper
                  airplane send button to send a message to the user.
                </Text>
              </>
            )}
            <TouchableOpacity onPress={toggleAnswer9}>
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                There is nobody learning the language I am learning? how can I
                find someone to chat with?
              </Text>
            </TouchableOpacity>
            {showAnswer9 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                ></View>
                <Text style={styles.answerText}>
                  Press the dice button to find a random user for a spontaneous
                  chat. Secondly, you can invite friends to the application to
                  chat with them.
                </Text>
              </>
            )}

            <TouchableOpacity onPress={toggleAnswer9}>
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                What does a "star" or "ribbon" mean when they appear on
                flashcards?
              </Text>
            </TouchableOpacity>
            {showAnswer9 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                ></View>
                <Text style={styles.answerText}>
                  The star means that you have seen the flashcard the optimal
                  number of times. The ribbon means that you are making progress
                  with this flashcard and should continue to review it.
                </Text>
              </>
            )}

            <TouchableOpacity onPress={toggleAnswer3}>
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                How do I contact customer support to ask a question?
              </Text>
            </TouchableOpacity>
            {showAnswer3 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "blue",
                      textDecorationLine: "underline",
                      marginLeft: 10,
                    }}
                    onPress={() => Linking.openURL("http://langiddy.com")}
                  >
                    Langiddy.com
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL("http://langiddy.com")}
                  >
                    <Text> Terms of Service -</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL("http://langiddy.com")}
                  >
                    <Text> Privacy policy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.answerText}>
                  If you have any questions or concerns or would like to see our
                  privacy policy click on the link "Langiddy" above or email us
                  at support@langiddy.com and we will get back to you as soon as
                  possible.
                </Text>
              </>
            )}

            <TouchableOpacity onPress={toggleAnswer10}>
              <Text style={styles.questionContainer}>Question:</Text>
              <Text style={styles.questionText}>
                How do I delete my account?
              </Text>
            </TouchableOpacity>
            {showAnswer10 && (
              <>
                <Text style={styles.answerContainer}>Answer:</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                ></View>
                <Text style={styles.answerText}>
                  Thank you for using Langiddy. We are sorry to see you go. If
                  you would like to delete your account, please go to account
                  settings and logout, then return to account settings after
                  logging back in and press the delete account button. This will
                  delete your account and all your data will be lost. This
                  action cannot be undone.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PageContainer>
  );
};

export default HelpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  questionContainer: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: "grey",
    textAlign: "left",
  },
  questionText: {
    fontSize: 16,
    fontFamily: "normal",
    fontFamily: "regular",
    color: "black",
    textAlign: "left",
    margin: 10,
  },
  answerContainer: {
    fontSize: 20,
    fontFamily: "bold",
    color: "black",
    textAlign: "left",
    margin: 10,
  },
  answerText: {
    fontSize: 16,

    fontFamily: "regular",
    color: colors.translationBubble,
    textAlign: "left",
    margin: 10,
  },
});
