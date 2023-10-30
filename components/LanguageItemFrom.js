import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";

const LanguageItemFrom = (props) => {
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

export default LanguageItemFrom;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey,
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
