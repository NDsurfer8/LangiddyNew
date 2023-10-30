import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import colors from "../constants/colors";
import * as Speech from "expo-speech";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  deletePhraseCard,
  masterPhraseCard,
} from "../utils/actions/phraseActions";
import { starPhraseCard } from "../utils/actions/phraseActions";
import mobileAds, {
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedInterstitialAd,
} from "react-native-google-mobile-ads";
import { useEffect } from "react";
import Purchases from "react-native-purchases";
import { useState } from "react";
import { addReward } from "../utils/actions/userActions";

const adUnitId = "ca-app-pub-7278635770152409/2276857476";

// Todo: Real unit id here: uncomment before publishing
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
//Todo:Rewarded Real unit id here: uncomment before publishing

// Test id below
// const interstitial = InterstitialAd.createForAdRequest(
//   "ca-app-pub-3940256099942544/4411468910"
// );

const FlashCard = (props) => {
  const { item, itemId } = props;
  console.log("item", itemId.item);

  const userData = useSelector((state) => state.auth.userData);

  const [isText, setIsText] = React.useState(true);
  const [isTranslation, setIsTranslation] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [runningCount, setRunningCount] = React.useState(0);
  const [showAd, setShowAd] = React.useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  const flipCard = () => {
    setIsText(!isText);
    setIsTranslation(!isTranslation);
    setCount(count + 1);
  };

  if (count === 8) {
    // put a Ribben on the card as a favorite
    const userId = userData.userId;
    starPhraseCard(userId, itemId.item);
    // when count is 8 show ad
    if (activeSubscriptions.length === 0) {
      //Todo: uncomment before publishing june 15th
      interstitial.show();
    }
    setCount(9);
  }

  if (count === 24) {
    // put a star on the card as a favorite
    const userId = userData.userId;
    masterPhraseCard(userId, itemId.item);
    // give the user an additional reward
    addReward(userData.userId, 1);

    // when count is 24 show ad
    if (activeSubscriptions.length === 0) {
      // Todo: uncomment before publishing june 15th
      interstitial.show();
    }
    //TODO: if set count at 25 then add up stars to give a reward
    setCount(0);
  }

  // TODO : this is the subscription code is good
  useEffect(() => {
    getUserInfo();
    // checks for updates to users subscription
    Purchases.addCustomerInfoUpdateListener((info) => {
      getUserInfo();
    });
  }, []);
  const getUserInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      // access latest customerInfo
      const { activeSubscriptions } = customerInfo;
      console.log("activeSubscriptions", activeSubscriptions);
      setActiveSubscriptions(activeSubscriptions);
      // console.log("customerInfo", customerInfo);
    } catch (e) {
      // Error fetching customer info
      console.log("error fetching customer info", e);
    }
  };

  // Todo: Loads the add
  const loadInterstitialAdd = () => {
    // this loads the ad
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setShowAd(true);
      }
    );
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setShowAd(false);
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  };
  useEffect(() => {
    // calls when component mounts to load add
    //step 1
    const unsubscribeInterstitial = loadInterstitialAdd();
    return unsubscribeInterstitial;
  }, []);

  const speak = () => {
    Speech.speak(item.translation, {
      language: item.to,
      pitch: 1,
      rate: 0.71,
    });
  };

  const deleteCard = async (item) => {
    const userId = userData.userId;
    await deletePhraseCard(userId, item);
  };
  // if item is not mastered dont allow card to be starred
  const ifMasteredRestudy = () => {
    if (item.mastered) {
      starPhraseCard(userData.userId, itemId.item);
    } else {
      Alert.alert("tap to flip card over");
    }
  };

  return (
    <>
      {isText ? (
        <TouchableOpacity
          // puts a bookmark on for more study
          onLongPress={ifMasteredRestudy}
          onPress={flipCard}
        >
          <View style={styles.flashCardContainer}>
            {(item.starred && item.mastered && (
              <FontAwesome
                name="star"
                size={24}
                color={colors.orange}
                style={{
                  position: "absolute",
                  // left: "91.1%",
                  left: Platform.isPad ? "92.1%" : "91.1%",
                  // bottom: 70,
                  bottom: Platform.isPad ? 116 : 70,
                  // opacity: 0.8,
                }}
              />
            )) ||
              (item.starred && (
                <FontAwesome
                  name="bookmark"
                  size={24}
                  color="brown"
                  style={{
                    position: "absolute",
                    left: "92%",
                    // bottom: 79,
                    bottom: Platform.isPad ? 125 : 75,
                    // opacity: 0.8,
                  }}
                />
              )) ||
              (item.mastered && (
                <FontAwesome
                  name="star"
                  size={24}
                  color={colors.orange}
                  style={{
                    position: "absolute",
                    left: "91.1%",
                    bottom: 70,
                  }}
                />
              ))}

            <Text numberOfLines={4} style={styles.text}>
              {item.translation}
            </Text>
          </View>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 40, right: 40 }}
            onPress={speak}
          >
            <Ionicons
              name="volume-low-outline"
              size={24}
              color={colors.translationBubble}
              style={styles.sound}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={flipCard}>
          <View style={styles.flashCardContainerAnswer}>
            <Text style={styles.translationColor}>{item.text}</Text>
          </View>
          <TouchableOpacity
            hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
            onPress={speak}
          >
            <Ionicons
              name="volume-low-outline"
              size={24}
              color={colors.translationBubble}
              style={styles.sound2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteCard(itemId.item)}
            hitSlop={{ top: 20, bottom: 20, left: 40, right: 40 }}
            style={styles.trashContainer}
          >
            <AntDesign
              name="delete"
              size={20}
              color="darkred"
              style={styles.trash}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </>
  );
};

export default FlashCard;
const styles = StyleSheet.create({
  flashCardContainer: {
    backgroundColor: "white",
    width: "100%",
    // height: 100,
    height: Platform.isPad ? 150 : 100,
    borderRadius: 20,
    borderBottomEndRadius: 0,
    borderTopEndRadius: 30,
    padding: 10,
    marginBottom: -10,
    borderColor: "white",
    borderWidth: 1,
    minWidth: "35%",
    justifyContent: "center",
    alignItems: "flex-start",

    backgroundColor: colors.flashCardAnswer,
  },
  sound2: {
    position: "absolute",
    left: "92%",
    bottom: 50,
    // opacity: 0.8,
  },
  flashCardContainerAnswer: {
    borderBottomStartRadius: 0,
    borderTopStartRadius: 30,
    backgroundColor: "white",
    width: "100%",
    // height: 150,
    height: Platform.isPad ? 250 : 150,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    borderColor: "white",
    borderWidth: 1,
    minWidth: "35%",
    justifyContent: "center",
    alignItems: "flex-end",

    backgroundColor: colors.flashCardAnswer,
  },
  text: {
    fontSize: Platform.isPad ? 30 : 20,
    color: colors.defaultTextColor,
    fontFamily: "regular",
    justifyContent: "center",
    alignItems: "center",
  },
  translationColor: {
    marginRight: 40,
    fontSize: Platform.isPad ? 30 : 20,
    color: colors.translationBubble,
    fontFamily: "regular",
    justifyContent: "center",
    alignItems: "center",
  },
  sound: {
    position: "absolute",
    left: "92%",
    bottom: 0,
    // opacity: 0.8,
  },

  trash: {
    // opacity: 0.1,
    marginLeft: "94%",
    marginBottom: 8,
  },
});
