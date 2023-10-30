import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";

const TranslationHistoryResult = (props) => {
  console.log(props.text);
  return (
    // allows to collaps after setting language
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.iconContainer}>
        {props.selected && <AntDesign name="check" size={18} color="black" />}
      </View>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default TranslationHistoryResult;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    flex: 1,
    flexDirection: "row",
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  text: {
    color: colors.defaultTextColor,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "regular",
  },
});
