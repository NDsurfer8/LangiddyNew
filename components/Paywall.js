import { Text, StyleSheet, Pressable, View } from "react-native";
import React from "react";

import { useNavigation } from "@react-navigation/native";

const Paywall = () => {
  const navigation = useNavigation();

  const onContinue = () => {
    navigation.navigate("PaymentScreen");
  };

  return (
    <View>
      <Text style={styles.title}>Keep reading</Text>
      <Text style={styles.text}>
        You've read all of your member-only stories this month. Get unlimited
        access to everything on Medium with a 1 month free trial.
      </Text>
      <Pressable onPress={onContinue} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    padding: 20,
    paddingVertical: 100,
  },
  title: {
    color: "white",
    fontSize: 30,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#41872D",
    marginVertical: 10,
    padding: 10,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
  },
});

export default Paywall;
