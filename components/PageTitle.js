import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import colors from "../constants/colors";

export default PageTitle = (props) => {
  return (
    <View style={styles.container}>
      <Text adjustsFontSizeToFit style={styles.title}>
        {props.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: Platform.isPad ? 50 : 28,
    letterSpacing: 0.05,
    color: colors.defaultTextColor,
    fontFamily: "bold",
  },
});
