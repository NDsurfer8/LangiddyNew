import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../constants/colors";

const SubmitButtonLogin = (props) => {
  const { onPress, style, color } = props;
  const enabledBgColor = colors.orange;
  const disabledBgColor = colors.grey;

  const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

  return (
    <TouchableOpacity
      style={{
        ...styles.submitButton,
        backgroundColor: bgColor,
        ...props.style,
      }}
      onPress={
        props.disabled ? () => console.log("Submit button disabled") : onPress
      }
    >
      <Text
        style={{
          ...styles.submitButtonText,
          color: props.disabled ? colors.defaultTextColor : colors.white,
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default SubmitButtonLogin;

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: colors.orange,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "semiBold",
    textAlign: "center",
  },
});
