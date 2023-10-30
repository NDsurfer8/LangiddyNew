import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import React from "react";
import defaultPic from "../assets/images/defaultPic10.png";
import colors from "../constants/colors";
import { Feather } from "@expo/vector-icons";
import {
  launchImagePicker,
  uploadImageAsync,
} from "../utils/imagePickerHelper";
import { updateSignedInUserData } from "../utils/actions/authActions";
import { updateLoggedInUserData } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { updateChatData } from "../utils/actions/chatActions";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";

const ProfileImageNonCached = (props) => {
  const { onlineStatus } = props;
  console.log("onlineStatus", onlineStatus);
  const dispatch = useDispatch();
  const source = props.uri ? { uri: props.uri } : defaultPic;
  // console.log("source", source);
  const userData = useSelector((state) => state.auth.userData);
  const [image, setImage] = React.useState(source);
  const [isLoading, setIsLoading] = React.useState(false);

  const showEditButton =
    props.showEditButton && props.showEditButton === true ? true : false;
  const showRemoveButton =
    props.showRemoveButton && props.showRemoveButton === true ? true : false;

  const userId = props.userId;
  const chatId = props.chatId;

  const pickImageHandler = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setIsLoading(true);
      const uploadUrl = await uploadImageAsync(tempUri, chatId !== undefined);
      setIsLoading(false);
      setImage({ uri: uploadUrl });
      if (!uploadUrl) {
        throw new Error("Image upload failed");
      }
      if (chatId) {
        await updateChatData(chatId, userId, { chatImage: uploadUrl });
      } else {
        const newData = { profilePic: uploadUrl };

        await updateSignedInUserData(userId, newData);
        dispatch(updateLoggedInUserData({ newData: newData }));
      }

      setImage({ uri: uploadUrl });
      return uploadUrl;
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const takePhotoHandler = async () => {
    try {
      const tempUri = await openCamera();
      if (!tempUri) return;
      setIsLoading(true);
      const uploadUrl = await uploadImageAsync(tempUri, chatId !== undefined);
      setIsLoading(false);
      setImage({ uri: uploadUrl });
      if (!uploadUrl) {
        throw new Error("Image upload failed");
      }
      if (chatId) {
        await updateChatData(chatId, userId, { chatImage: uploadUrl });
      } else {
        const newData = { profilePic: uploadUrl };

        await updateSignedInUserData(userId, newData);
        dispatch(updateLoggedInUserData({ newData: newData }));
      }

      setImage({ uri: uploadUrl });
      return uploadUrl;
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const photoSelectHandler = () => {
    // have the alert allow user to choose between calling pickImageHandler or takePhotoHandler
    Alert.alert(
      "Choose a photo",
      "Would you like to take a photo or choose one from your library?",
      [
        {
          text: "Take Photo",
          onPress: () => takePhotoHandler(),
        },
        {
          text: "Choose from Library",
          onPress: () => pickImageHandler(),
        },
      ]
    );
  };

  const Container = props.onPress || showEditButton ? TouchableOpacity : View;
  // used container to make image not clicable when showEditButton is false
  return (
    <Container
      style={styles.container}
      onPress={props.onPress || photoSelectHandler}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <View>
          <Image
            source={image}
            style={{
              ...styles.image,
              ...{ width: props.size, height: props.size },
            }}
          />
          {/* {!onlineStatus ? (
            <View
              style={{
                position: "absolute",
                backgroundColor: "green",
                height: 14,
                width: 14,
                borderColor: "white",
                borderWidth: 1.5,
                borderRadius: 100 / 1,
                marginLeft: props.size - 18,
                marginTop: props.size - 14,
              }}
            ></View>
          ) : null} */}
        </View>
      )}

      {showEditButton && !isLoading && (
        <View>
          <Feather
            name="edit"
            size={15}
            color="black"
            style={styles.editIcon}
          />
        </View>
      )}
      {showRemoveButton && !isLoading && (
        <View style={styles.removeIconContainer}>
          <Feather
            name="x"
            size={10}
            color={colors.orange}
            style={styles.removeIcon}
          />
        </View>
      )}
    </Container>
  );
};

export default ProfileImageNonCached;
const styles = StyleSheet.create({
  container: {},
  image: {
    borderRadius: 100 / 1,
    overflow: "hidden",
    // borderWidth: 1,
    // borderColor: colors.defaultTextColor,
    resizeMode: "cover",
  },
  editIcon: {
    position: "absolute",
    bottom: 88,
    right: -5,
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: 5,
  },
  removeIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: 5,
  },
  removeIcon: {
    position: "absolute",
    top: 0,
    left: 2,

    padding: 5,
  },
});
