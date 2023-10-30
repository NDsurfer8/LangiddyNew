import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";
import ProfileImage from "./ProfileImage";
import colors from "../constants/colors";
import { Entypo } from "@expo/vector-icons";
import ProfileImageNonCached from "./ProfileImageNonCached";
import MainProfilePic from "./MainProfilePic";
import ImageSettingsHelper from "./ImageSettingsHelper";
const DataItem = (props) => {
  const { title, subTitle, image, type, isChecked, icon } = props;

  const hideImage = props.hideImage && props.hideImage === true;

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        {!icon &&
          !hideImage &&
          (image ? (
            <MainProfilePic uri={image} size={60} style={styles.image} />
          ) : (
            <ImageSettingsHelper uri={image} size={60} style={styles.image} />
          ))}
        {icon && (
          <View style={styles.leftIconContainer}>
            <Entypo name={icon} size={24} color={colors.orange} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subTitle && (
            <Text style={styles.subTitle} numberOfLines={1}>
              {subTitle}
            </Text>
          )}
        </View>
        {type === "checkBox" && (
          <View
            style={{
              ...styles.iconContainer,
              ...(isChecked && styles.checkedStyle),
            }}
          >
            {isChecked ? (
              <Entypo name="check" size={24} color={colors.orange} />
            ) : (
              <Entypo name="check" size={24} color={"transparent"} />
            )}
          </View>
        )}

        {type === "link" && (
          <View style={""}>
            <Entypo name="chevron-right" size={24} color={colors.orange} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DataItem;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 70,
  },
  image: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.defaultTextColor,
  },
  subTitle: {
    fontSize: 14,
    color: colors.defaultTextColor,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.nearlyWhite,
    borderBottomEndRadius: 0,
    padding: 0,
  },
  checkedStyle: {
    backgroundColor: colors.lightGrey,
    borderColor: colors.orange,
  },
  leftIconContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
});
