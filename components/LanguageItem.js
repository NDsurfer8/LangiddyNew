import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const LanguageItem = (props) => {
  const history = useSelector((state) => state.history.history);
  console.log(
    "history",
    history.phrases.map((phrase) => phrase.to)
  );
  const userData = useSelector((state) => state.auth.userData);

  console.log("props", props);

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

export default LanguageItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.flashCard,
    opacity: 0.8,
    padding: 15,
    borderRadius: 10,
    margin: 1,
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
    fontSize: 26,
    textAlign: "center",
    fontFamily: "regular",
  },
});
