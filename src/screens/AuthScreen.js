//             <Text style={styles.copyRight}>Copyright © 2023 Langiddy</Text>
//             <Text style={styles.copyRightLow}>All rights reserved.</Text>
//

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import PageContainer from "../../components/PageContainer";
import AuthInput from "../../components/AuthInput";
import { Image } from "expo-image";
import Icon from "../../assets/images/langiddyIcon.png";
import colors from "../../constants/colors";
import SubmitButtonLogin from "../../components/SubmitButtonLogin";
import Swiper from "react-native-swiper";
import SignUpForm from "../../components/SignUpForm";
import SignInForm from "../../components/SignInForm";
import ForgotPassword from "../../components/ForgotPassword";
import { Entypo } from "@expo/vector-icons";

const AuthScreen = (props) => {
  const [continuePressed, setContinuePressed] = React.useState(false);
  const [loginPressed, setLoginPressed] = React.useState(true);
  const [resetPassword, setResetPassword] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <PageContainer
        style={{
          // can do dark mode here if you want
          backgroundColor: "#fff",
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            showVerticalScrollIndicator: false,
          }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "center" }}
            behavior={Platform.OS === "ios" ? "height" : undefined}
          >
            {!continuePressed && (
              <View
                style={{
                  marginTop: 120,
                  paddingHorizontal: 20,
                }}
              >
                <View>
                  <Entypo
                    name="chevron-thin-left"
                    size={24}
                    color="black"
                    style={{
                      position: "absolute",
                      marginTop: "70%",
                    }}
                  />
                  <Swiper
                    style={styles.sliderContainer}
                    autoplay
                    autoplayTimeout={3}
                    showsPagination={false}
                  >
                    <Image
                      source={require("../../assets/images/dontLose.png")}
                      style={styles.slideImage}
                      contentFit="contain"
                    />
                    <Image
                      source={require("../../assets/images/readAnd.png")}
                      style={styles.slideImage}
                      contentFit="contain"
                    />
                    <Image
                      source={require("../../assets/images/studyPhrase.png")}
                      style={styles.slideImage}
                      contentFit="contain"
                    />
                  </Swiper>
                  <Entypo
                    name="chevron-thin-right"
                    size={24}
                    color="black"
                    style={{
                      position: "absolute",
                      marginTop: "70%",
                      right: -25,
                    }}
                  />
                </View>

                <SubmitButtonLogin
                  onPress={() => setContinuePressed(true)}
                  title="Use it!            "
                  style={{
                    backgroundColor: "orange",
                    alignSelf: "center",
                    marginTop: 20,
                    paddingHorizontal: 20,
                  }}
                />
              </View>
            )}
            {
              // if the SubmitButtonLogin is pressed, then show the Signup component
              continuePressed && !loginPressed && (
                <SignUpForm
                  goback={() => setContinuePressed(false)}
                  disabled={false}
                  login={() => {
                    setLoginPressed(true);
                  }}
                />
              )
            }
            {continuePressed && loginPressed && !resetPassword && (
              <SignInForm
                goback={() => setContinuePressed(false)}
                disabled={false}
                register={() => {
                  setLoginPressed(false);
                }}
                passwordReset={() => setResetPassword(true)}
              />
            )}

            {
              // if the forgot password button is pressed, then show the ForgotPassword component
              resetPassword && (
                <ForgotPassword goback={() => setResetPassword(false)} />
              )
            }
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelText: {
    fontSize: 20,
    color: colors.defaultTextColor,
    fontFamily: "semiBold",
  },
  sliderContainer: {
    height: Platform.isPad ? 800 : 440,
  },
  slideImage: {
    flex: 1,
    width: null,
    height: null,
  },
});
