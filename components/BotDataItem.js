import * as Notifications from "expo-notifications";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React from "react";
import ProfileImage from "./ProfileImage";
import colors from "../constants/colors";
import { Entypo, AntDesign } from "@expo/vector-icons";
import ProfileImageNonCached from "./ProfileImageNonCached";
import { useState } from "react";

const BotDataItem = (props) => {
  const { title, subTitle, image, type, isChecked, icon } = props;

  const hideImage = props.hideImage && props.hideImage === true;

  const deleteUserChat = () => {
    props.deleteUserChat();
  };
  // show a blue dot when a new message is received
  const maxlimit = 26;

  // when long press on a chat, remove the blue dot for 24 hours then show it again

  const hideBlueDot = () => {
    //Maybe get rid of hide blue dot or badge count here
    props.hideBlueDot();
  };

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={props.onPress}
        onLongPress={hideBlueDot}
      >
        <View style={styles.container}>
          {/* {
            // show a blue dot when a new message is received
            props.showBlueDot && <View style={styles.blueDot}></View>
          } */}
          {!icon &&
            !hideImage &&
            (image ? (
              <ProfileImage uri={image} size={60} style={styles.image} />
            ) : (
              <ProfileImageNonCached
                uri={image}
                size={60}
                style={styles.image}
              />
            ))}
          {icon && (
            <View style={styles.leftIconContainer}>
              <Entypo name={icon} size={24} color={colors.orange} />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text
              style={props.showBlueDot ? styles.titleOrange : styles.title}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subTitle && (
              <Text style={styles.subTitle} numberOfLines={1}>
                {subTitle.length > maxlimit
                  ? subTitle.substring(0, maxlimit - 3) + "..."
                  : subTitle}
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
      <View style={styles.x}>
        <TouchableOpacity
          hitSlop={{ top: 40, bottom: 40, left: 20, right: 40 }}
          onPress={() => deleteUserChat()}
        >
          <AntDesign
            name="close"
            size={Platform.isPad ? 17 : 11}
            color={"darkred"}
            style={styles.close}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BotDataItem;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 70,
    paddingHorizontal: 0,
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
  titleOrange: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.orange,
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
  x: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  close: {
    position: "absolute",
    opacity: 0.5,
  },
  blueDot: {
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 10,
    height: 10,
    backgroundColor: colors.orange,
    opacity: 0.8,
    borderRadius: 50,
    marginRight: 10,
    // position: "absolute",
  },
});
