import React, { useEffect, useState } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Purchases from "react-native-purchases";
import PurchasesOffering from "react-native-purchases";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../constants/colors";
import { setSubscription } from "../../utils/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
// Paywall for sending messages and creating flashcards
export default function PaymentScreen(props) {
  console.log("props", props);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOffering, setCurrentOffering] = useState([]);
  // <PurchasesOffering /> || null
  console.log("currentOffering", currentOffering);
  const userData = useSelector((state) => state.auth.userData);
  console.log("userData", userData.userId);
  useEffect(() => {
    // getting offers when screen mount

    const main = async () => {
      try {
        // Purchases.setDebugLogsEnabled(true);
        // await Purchases.configure({
        //   apiKey: "appl_iBwupnXztfutoEAHoCNgoBBkpER",
        //   appUserID: userData.userId,
        // });
        // just put in login
        const { customerInfo } = await Purchases.logIn(userData.userId);
        console.log("customerInfoPayScreen", customerInfo);

        const offerings = await Purchases.getOfferings(["LangiddyProMonthly"]);
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          console.log("offerings", offerings);
          setCurrentOffering(offerings.current);
        }
      } catch (e) {
        console.log(e);
      }
    };
    main();
  }, []);

  const buyPackage = async (pkg) => {
    setIsLoading(true);
    try {
      console.log("pkg", pkg);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (typeof customerInfo.entitlements.active.pro !== "undefined") {
        // Unlock that great "pro" content
        setIsLoading(false);
        //TODO: in new changed way i have goBack again.
        navigation.goBack();
        // after purchasing set to true
        props.setTrue();
        await setSubscription(
          userData.userId,
          customerInfo.entitlements.active.pro.isActive
        );
        setIsLoading(false);
      }
    } catch (e) {
      if (!e.userCancelled) {
        console.log(e);
        setIsLoading(false);
        // Alert.alert("Please try again later.");
      }
    }
    setIsLoading(false);

    // Alert.alert("Please try again if you wish to purchase a subscription.");
  };

  const navigation = useNavigation();
  const close = () => {
    props.navigation.goBack();
  };

  const Footer = () => {
    return (
      <>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            // padding: 20,
          }}
          onPress={() => navigation.navigate("privacyPolicy")}
        >
          <Text style={styles.Footer}>Privacy policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            // padding: 20,
          }}
          onPress={() => navigation.navigate("termsOfService")}
        >
          <Text style={styles.Footer}>Terms of service</Text>
        </TouchableOpacity>
      </>
    );
  };
  if (!currentOffering.availablePackages) return null;

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.close} onPress={close}>
        <AntDesign name="close" color={"white"} size={24} />
      </TouchableOpacity> */}
      <Text style={styles.title}>
        Try free for {""}
        {currentOffering.availablePackages.map((pkg) => {
          return (
            <Text style={styles.title}>
              {pkg.product.introPrice.periodNumberOfUnits}{" "}
              {pkg.product.introPrice.periodUnit.toLowerCase()}s!
            </Text>
          );
        })}
      </Text>
      <Text style={styles.subTitle}>
        {currentOffering.availablePackages.map((pkg) => {
          return <Text style={styles.bold}>{pkg.product.description}:</Text>;
        })}
      </Text>
      <View>
        <Text
          style={{
            fontFamily: "regular",
          }}
        >
          - Addvertisment free experience
        </Text>

        <Text
          style={{
            fontFamily: "regular",
          }}
        >
          - Language exchange with native speakers
        </Text>

        <Text
          style={{
            fontFamily: "regular",
          }}
        >
          - Chat with friends in your target language
        </Text>
        <Text
          style={{
            fontFamily: "regular",
          }}
        >
          - Maximize your learning with flashcards
        </Text>
      </View>

      <View style={styles.blackBox}>
        <Text style={styles.offerTitle}>
          {currentOffering.availablePackages.map((pkg) => {
            return (
              <Text style={styles.bold}>{pkg.product.priceString} / month</Text>
            );
          })}
        </Text>

        {!isLoading ? (
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => buyPackage(currentOffering.availablePackages[0])}
          >
            <Text>Subscribe</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            size="large"
            color={colors.orange}
            style={{ marginTop: 20 }}
          />
        )}
        <View>
          <Ionicons
            name="ios-chevron-down-sharp"
            size={24}
            color="black"
            style={{
              color: "white",
              textAlign: "center",
              // marginVertical: 35,
            }}
          />
        </View>
      </View>
      <Text
        style={{
          color: colors.defaultTextColor,
          marginTop: 17,
          fontSize: 11,
          fontFamily: "regular",
          lineHeight: 0,
          // padding: 10,
          paddingHorizontal: Platform.isPad ? 250 : 0,
        }}
      >
        {currentOffering.availablePackages.map((pkg) => {
          return <>{pkg.product.priceString} </>;
        })}
        will be applied monthly to your iTunes account at the end of the free
        trial period on confirmation. Subscriptions will automatically renew
        unless canceled within 24-hours before the end of the current period.
        You may cancel anytime with your iTunes account settings. Any unused
        portion of a free trial will be forfeited if you purchase a
        subscription. For more information, see our link to our terms of service
        and privacy policy.
      </Text>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "orange",
    // opacity: 0.9,

    flex: 1,
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
    // borderRadius: 10,
    marginBottom: 26,
    position: "relative",
  },
  title: {
    fontSize: Platform.isPad ? 40 : 30,
    fontFamily: "semiBold",
    color: colors.white,
    textAlign: "center",
    marginVertical: Platform.isPad ? 80 : 0,
  },
  titleText: {
    fontFamily: "semiBold",
  },
  subTitle: {
    color: colors.white,
    textAlign: "center",
    marginVertical: Platform.isPad ? 50 : 15,
    fontSize: Platform.isPad ? 26 : 20,
    fontFamily: "semiBold",
    lineHeight: 24,
  },
  blackBox: {
    backgroundColor: colors.defaultTextColor,
    marginTop: Platform.isPad ? "10%" : 17,
    width: Platform.isPad ? "50%" : "100%",
    height: Platform.isPad ? "20%" : "30%",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  offerTitle: {
    color: colors.white,
    fontSize: 20,
    marginVertical: 15,
  },
  bold: {
    fontFamily: "bold",
  },
  listItem: {
    fontFamily: "regular",
    marginVertical: 5,
  },
  buttonPrimary: {
    backgroundColor: colors.white,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    padding: 15,
    margin: 10,
  },
  buttonText: {
    fontFamily: "regular",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  arrowDown: {
    color: colors.white,
    textAlign: "center",
  },
  footerText: {
    color: colors.defaultTextColor,
    marginTop: 17,
    fontSize: 11,
    fontFamily: "regular",
    lineHeight: 0,
    paddingHorizontal: Platform.isPad ? 250 : 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  footerLink: {
    color: colors.lightGrey,
    fontSize: 11,
    fontFamily: "regular",
    marginTop: "auto",
  },
  close: {
    position: "absolute",
    left: 5,
    top: 5,
  },
});
