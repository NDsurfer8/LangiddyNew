import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";
import Colors from "../constants/colors";

const SubmitButton = (props) => {
  const enabledBgColor = props.color || Colors.primary;
  const disabledBgColor = Colors.white;
  const backgroundColor = props.disabled ? disabledBgColor : enabledBgColor;

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        ...{ backgroundColor: backgroundColor },
        ...props.style,
      }}
      onPress={props.disabled ? () => {} : props.onPress}
    >
      <Text
        style={{
          color: props.disabled ? Colors.nearlyWhite : Colors.nearlyWhite,
          ...styles.buttonText,
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};
export default SubmitButton;
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.blue,
    paddingVertical: 10,

    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: Colors.nearlyWhite,
    fontFamily: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
