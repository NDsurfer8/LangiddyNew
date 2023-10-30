import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";

import React from "react";
import { getPasswordResetEmail } from "../../utils/actions/authActions";

const ForgotPassword = (props) => {
  const [email, setEmail] = React.useState("");

  const resetPassword = async (email) => {
    // TODO: Firebase stuff reset password
    console.log("Reset password for email: ", email);
    await getPasswordResetEmail(email);
    Alert.alert("Password reset email sent");
    props.setForgotenPassword(false);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Please enter your email to reset your password.
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "80%",
          paddingHorizontal: 0,
        }}
      >
        <Button title="Back" onPress={() => props.setForgotenPassword(false)} />
        <Button
          title="Send"
          onPress={() => {
            resetPassword(email);
          }}
        />
      </View>
    </View>
  );
};

export default ForgotPassword;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
