import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const AuthInput = (props) => {
  const { id } = props;

  const onChangeText = (text) => {
    props.onInputChanged(id, text);
  };
  return (
    <View>
      <Text>{props.label}</Text>
      <View
        style={{
          backgroundColor: "#f2f2f2",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <TextInput
          {...props}
          style={{
            height: 26,
          }}
          placeholderTextColor={"#999"}
          onChangeText={onChangeText}
        />
      </View>
      {props.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.error[0]}</Text>
        </View>
      )}
    </View>
  );
};

export default AuthInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "darkred",
    fontSize: 13,
    fontFamily: "regular",
  },
});
