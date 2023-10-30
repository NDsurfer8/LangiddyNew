import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import React, { useState } from "react";
import colors from "../constants/colors";

const InputAbout = (props) => {
  console.log(props.iconPack);
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
          multiline={true}
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
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

export default InputAbout;
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.lightGrey,
    backgroundColor: colors.lightGreyBubble,
    borderRadius: 11,
    borderBottomStartRadius: 0,
    marginTop: 10,
    height: Platform.isPad ? 170 : 100,
    width: Platform.isPad ? "98%" : "95%",
    marginLeft: 3,
    numberOfLines: 5,
    padding: 10,
  },
  icon: {
    marginRight: 10,
    color: colors.defaultTextColor,
  },
  label: {
    marginVertical: Platform.isPad ? 30 : 5,
    fontFamily: "semiBold",
    fontSize: Platform.isPad ? 26 : 16,
    letterSpacing: 1,
    color: colors.defaultTextColor,
  },
  input: {
    flex: 1,
    fontFamily: "regular",
    fontSize: Platform.isPad ? 26 : 16,
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
