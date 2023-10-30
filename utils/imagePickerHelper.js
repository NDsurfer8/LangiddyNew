import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { getFirebase } from "./firebaseHelper";
import * as ImageManipulator from "expo-image-manipulator";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import uuid from "react-native-uuid";
import { v4 as uuidv4 } from "uuid";
uuid.v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

export const launchImagePicker = async () => {
  await checkPermissions();
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.1,
  });
  if (!result.canceled) {
    console.log(result);
    return result.assets[0].uri;
  }
  return null;
};

export const openCamera = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted === false) {
    console.log("Permission to access camera roll is required!");
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.1,
  });
  if (!result.canceled) {
    console.log(result);
    return result.assets[0].uri;
  }
  return null;
};

export const uploadImageAsync = async (uri, isChatImage = false) => {
  const app = getFirebase();
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const pathFolder = isChatImage ? "chatImages" : "profilePictures";
  const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);
  await uploadBytesResumable(storageRef, blob);
  blob.close();
  const url = await getDownloadURL(storageRef);
  return url;
};

const checkPermissions = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return Promise.reject("Permission denied");
    }
  }
  return Promise.resolve();
};
