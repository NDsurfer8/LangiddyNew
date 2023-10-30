import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";

import React from "react";
import { getPasswordResetEmail } from "../utils/actions/authActions";

const ForgotPassword = (props) => {
  const { goback } = props;

  const [email, setEmail] = React.useState("");

  const resetPassword = async (email) => {
    // TODO: Firebase stuff reset password
    console.log("Reset password for email: ", email);
    await getPasswordResetEmail(email);
    Alert.alert("Password reset email sent");
    props.goback(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Please enter your email to reset your password.
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => goback()} style={styles.button}>
          <Text style={styles.buttonText}>Back </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => resetPassword(email)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: "70%",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 40,
    marginVertical: 12,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    // borderColor: "#ccc",
    // backgroundColor: "#f4f4f4",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
