import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import colors from "../constants/colors";

const Input = (props) => {
  const [value, setValue] = useState(props.initialValue || "");
  console.log(value);
  const onChangeText = (text) => {
    setValue(text);
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        {props.icon && (
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 24}
            color="black"
            style={styles.icon}
          />
        )}
        <TextInput
          {...props}
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          maxLength={props.maxLength}
        />
      </View>
      {props.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.error}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.lightGreyBubble,
    borderRadius: 20,
    borderBottomEndRadius: 0,
    padding: 10,
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: colors.grey,
  },
  label: {
    marginVertical: 10,
    fontFamily: "bold",
    fontSize: 16,
    letterSpacing: 1,
    color: colors.defaultTextColor,
  },
  input: {
    flex: 1,
    fontFamily: "regular",
    fontSize: 16,
    letterSpacing: 1,
    color: colors.defaultTextColor,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontFamily: "regular",
    fontSize: 14,
    letterSpacing: 1,
  },
});
