import { View, Text, StyleSheet } from "react-native";
import React from "react";
import colors from "../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
const ReplyTo = (props) => {
  const { text, user, onCancel } = props;
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>
      <TouchableOpacity style={styles.cancel} onPress={onCancel}>
        <MaterialIcons name="cancel" size={24} color="grey" />
      </TouchableOpacity>
    </View>
  );
};

export default ReplyTo;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E2DACC",
    padding: 10,
    borderRadius: 10,
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftColor: colors.orange,
    borderLeftWidth: 5,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cancel: {
    fontSize: 16,
    color: colors.primary,
  },
});
