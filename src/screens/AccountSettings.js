import { View, Text, Alert, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import SubmitButton from "../../components/SubmitButton";
import {
  deleteSignedInUserData,
  recentLogin,
  updateSignedInUserData,
  userLogout,
} from "../../utils/actions/authActions";
import { useDispatch } from "react-redux";
import { logout, updateLoggedInUserData } from "../../store/authSlice";
import { useSelector } from "react-redux";
import PageContainer from "../../components/PageContainer";
import { getFirebase } from "../../utils/firebaseHelper";
import { getAuth } from "firebase/auth";
import * as StoreReview from "expo-store-review";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import Purchases from "react-native-purchases";
import colors from "../../constants/colors";
import { getDatabase, ref, update } from "firebase/database";
import { setChatsData } from "../../store/chatSlice";
import * as AppleAuthentication from "expo-apple-authentication";
import { setStoredUsers } from "../../store/userSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback } from "react";

const AccountSettings = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = React.useState(userData.darkMode);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  // review the app function
  const requestReview = async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview().then((res) => {
        console.log(res);
      });
    }
  };

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

  const restoreTransactionsHandler = async () => {
    try {
      const restore = await Purchases.restorePurchases((purchaserInfo) => {
        console.log("purchaserInfo", purchaserInfo);
      });
      // ... check restored purchaserInfo to see if entitlement is now active
      console.log("restore", restore);
      if (restore) {
        Alert.alert(
          "Success!",
          "Your purchases have been restored. Thank you for your support!"
        );
      }
    } catch (e) {}
  };

  const ShowPremiumHandler = async () => {
    // when function is called return payment screen
    props.navigation.navigate("PaymentScreen");
  };

  const [locale, setLocale] = React.useState(Localization.locale);
  const i18n = new I18n({
    "en-US": {
      "Account Settings": "Account Settings",
      "Restore purchases": "Restore purchases",
      "Tap here to rate the app": "Tap here to rate the app",
      "Delete Account": "Delete Account",
      "Please logout before signing back in to delete your account for security purposes":
        "Please logout before signing back in to delete your account for security purposes",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "Are you sure you want to delete your account? all your data will be lost. This action is irreversible",
      Delete: "Delete",
      Cancel: "Cancel",
      Logout: "Logout",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at",
      "Terms of Service": "Terms of Service",
      "Privacy policy": "Privacy policy",
      "Are you sure you want to logout": "Are you sure you want to logout?",
    },
    "en-MX": {
      "Account Settings": "Configuración de la cuenta",
      "Restore purchases": "Restaurar compras",
      "Tap here to rate the app": "Toque aquí para calificar la aplicación",
      "Delete Account": "Eliminar cuenta",
      "Please logout before signing back in to delete your account for security purposes":
        "Cierre la sesión antes de volver a iniciar sesión para eliminar su cuenta por motivos de seguridad",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "¿Estás seguro de que quieres eliminar tu cuenta? todos tus datos se perderán. Esta acción es irreversible.",
      Delete: "Eliminar",
      Cancel: "Cancelar",
      Logout: "Cerrar sesión",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "Si tiene alguna pregunta sobre nuestra política de privacidad o nuestros términos de servicio, presione el enlace a continuación para ir a nuestro sitio web. También puede contactarnos en",
      "Terms of Service": "Términos de servicio",
      "Privacy policy": "Política de privacidad",
      "Are you sure you want to logout":
        "¿Estás seguro de que quieres cerrar sesión?",
    },
    "es-MX": {
      "Restore purchases": "Restaurar compras",
      "Account Settings": "Configuración de la cuenta",
      "Tap here to rate the app": "Toque aquí para calificar la aplicación",
      "Delete Account": "Eliminar cuenta",
      "Please logout before signing back in to delete your account for security purposes":
        "Cierre la sesión antes de volver a iniciar sesión para eliminar su cuenta por motivos de seguridad",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "¿Estás seguro de que quieres eliminar tu cuenta? todos tus datos se perderán. Esta acción es irreversible.",
      Delete: "Eliminar",
      Cancel: "Cancelar",
      Logout: "Cerrar sesión",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "Si tiene alguna pregunta sobre nuestra política de privacidad o nuestros términos de servicio, presione el enlace a continuación para ir a nuestro sitio web. También puede contactarnos en",
      "Terms of Service": "Términos de servicio",
      "Privacy policy": "Política de privacidad",
      "Are you sure you want to logout":
        "¿Estás seguro de que quieres cerrar sesión?",
    },
    "en-JP": {
      "Restore purchases": "購入を復元する",
      "Account Settings": "アカウント設定",
      "Tap here to rate the app": "アプリを評価するにはここをタップ",
      "Delete Account": "アカウントを削除する",
      "Please logout before signing back in to delete your account for security purposes":
        "セキュリティ上の理由から、アカウントを削除する前にログアウトしてください",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "アカウントを削除してもよろしいですか？すべてのデータが失われます。このアクションは元に戻せません。",
      Delete: "削除する",
      Cancel: "キャンセル",
      Logout: "ログアウト",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "プライバシーポリシーまたは利用規約に関するご質問がございましたら、以下のリンクをクリックして当社のウェブサイトにアクセスするか、お問い合わせください",
      "Terms of Service": "利用規約",
      "Privacy policy": "プライバシーポリシー",
      "Are you sure you want to logout": "ログアウトしてもよろしいですか？",
    },
    "ja-JP": {
      "Account Settings": "アカウント設定",
      "Restore purchases": "購入を復元する",
      "Tap here to rate the app": "アプリを評価するにはここをタップ",
      "Delete Account": "アカウントを削除する",
      "Please logout before signing back in to delete your account for security purposes":
        "セキュリティ上の理由から、アカウントを削除する前にログアウトしてください",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "アカウントを削除してもよろしいですか？すべてのデータが失われます。このアクションは元に戻せません。",
      Delete: "削除する",
      Cancel: "キャンセル",
      Logout: "ログアウト",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "プライバシーポリシーまたは利用規約に関するご質問がございましたら、以下のリンクをクリックして当社のウェブサイトにアクセスするか、お問い合わせください",
      "Terms of Service": "利用規約",
      "Privacy policy": "プライバシーポリシー",
      "Are you sure you want to logout": "ログアウトしてもよろしいですか？",
    },
    "en-CN": {
      "Account Settings": "帐户设定",
      "Restore purchases": "恢复购买",
      "Tap here to rate the app": "点击此处评价应用程序",
      "Delete Account": "删除帐户",
      "Please logout before signing back in to delete your account for security purposes":
        "出于安全考虑，请在登录后注销以删除您的帐户",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "您确定要删除帐户吗？您的所有数据都将丢失。此操作不可逆。",
      Delete: "删除",
      Cancel: "取消",
      Logout: "登出",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "如果您对我们的隐私政策或服务条款有任何疑问",
      "Terms of Service": "服务条款",
      "Privacy policy": "隐私政策",
      "Are you sure you want to logout": "您确定要注销吗？",
    },
    "zh-CN": {
      "Account Settings": "帐户设定",
      "Restore purchases": "恢复购买",
      "Tap here to rate the app": "点击此处评价应用程序",
      "Delete Account": "删除帐户",
      "Please logout before signing back in to delete your account for security purposes":
        "出于安全考虑，请在登录后注销以删除您的帐户",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "您确定要删除帐户吗？您的所有数据都将丢失。此操作不可逆。",
      Delete: "删除",
      Cancel: "取消",
      Logout: "登出",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "如果您对我们的隐私政策或服务条款有任何疑问",
      "Terms of Service": "服务条款",
      "Privacy policy": "隐私政策",
      "Are you sure you want to logout": "您确定要注销吗？",
    },
    "zh-TW": {
      "Account Settings": "帳戶設定",
      "Tap here to rate the app": "點擊此處評價應用程序",
      "Delete Account": "刪除帳戶",
      "Please logout before signing back in to delete your account for security purposes":
        "出於安全考慮，請在登錄後註銷以刪除您的帳戶",
      "Are you sure you want to delete your account all your data will be lost This action is irreversible":
        "您確定要刪除帳戶嗎？您的所有數據都將丟失。此操作不可逆。",
      Delete: "刪除",
      Cancel: "取消",
      Logout: "登出",
      "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at":
        "如果您對我們的隱私政策或服務條款有任何疑問",
      "Terms of Service": "服務條款",
      "Privacy policy": "隱私政策",
      "Restore purchases": "恢復購買",
      "Are you sure you want to logout": "您確定要註銷嗎？",
    },
  });

  i18n.defaultLocale = "en-US";
  console.log("i18n.defaultLocale", i18n.defaultLocale);
  i18n.locale = locale;
  console.log("i18n.locale", i18n.locale);
  i18n.enableFallback = true;
  console.log("i18n.fallbacks", i18n.enableFallback);

  const deleteAccountHandler = async (userId) => {
    // get user authorization before delteting account
    getAuth(getFirebase());

    if (userData.lastLogin === true || getAuth().currentUser) {
      try {
        const result = await deleteSignedInUserData(userId);
        console.log("result", result);
        if (result === true) {
          dispatch(setChatsData([]));
          dispatch(logout());
        }
        if (result === false) {
          Alert.alert("Account deleted. press the logout button.");
        }
      } catch (err) {
        console.log("err", err);
      }
    } else {
      Alert.alert("Please logout and sign in to delete your account.");
    }
  };
  const isAuth = useSelector((state) => !!state.auth.token);
  const chats = useSelector((state) => state.chats.chatsData);

  // const logoutHandler = async (user) => {

  //   recentLogin(userData.userId);
  //   dispatch(setChatsData([]));
  //   dispatch(userLogout(user));
  // };

  const logoutHandler = async (user) => {
    console.log("userLogout", user);
    try {
      // Perform any necessary cleanup or asynchronous operations here
      await recentLogin(userData.userId);
      dispatch(setChatsData([]));

      // Update user status to offline before logging out
      const app = getFirebase();
      const db = getDatabase(app);
      const userRef = ref(db, `users/${user.userId}`);
      await update(userRef, { onlineStatus: "Offline" });

      // Dispatch the logout action
      dispatch(userLogout(user));
    } catch (error) {
      // Handle any errors that occur during the cleanup process
      console.error("Error during logout:", error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const toggleDarkMode = useCallback(async () => {
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, {
        darkMode: !darkMode,
      });
      dispatch(updateLoggedInUserData({ newData: { darkMode: !darkMode } }));
      setDarkMode(!darkMode);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [darkMode, dispatch]);

  return (
    <PageContainer darkMode={darkMode}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "bold",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {i18n.t("Account Settings")}
        </Text>
        <View>
          <Text
            style={{
              fontSize: 16,

              fontFamily: "regular",
              //   textAlign: "center",
              marginTop: 20,
            }}
          >
            {i18n.t(
              "If you have any questions regarding or privacy policy or terms of service please press on the link below to go to our website, contact us at"
            )}{" "}
            support@langiddy.com
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          marginTop: 20,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "dodgerblue",
            textDecorationLine: "underline",
            marginLeft: 10,
            fontFamily: "regular",
            fontSize: 16,
          }}
          onPress={() => Linking.openURL("http://langiddy.com")}
        >
          Langiddy
        </Text>

        {activeSubscriptions.length === 0 ? (
          <TouchableOpacity
            style={{
              // borderRadius: 10,
              paddingHorizontal: 20,

              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={restoreTransactionsHandler}
          >
            <Text
              style={{
                color: "dodgerblue",
                fontFamily: "regular",
                fontSize: 16,
              }}
            >
              {i18n.t("Restore purchases")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              // borderRadius: 10,
              paddingHorizontal: 20,
            }}
            onPress={requestReview}
          >
            <Text
              style={{
                color: "dodgerblue",
                fontFamily: "regular",
                fontSize: 16,
              }}
            >
              Rate Langiddy
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        {activeSubscriptions.length === 0 && (
          <Text
            style={{
              fontSize: 16,
              fontFamily: "semiBold",
            }}
          >
            Go ad free?
          </Text>
        )}
        {activeSubscriptions.length !== 0 ? (
          <TouchableOpacity
            onPress={ShowPremiumHandler}
            disabled={true}
            style={{ marginBottom: "60%", marginTop: 20 }}
          >
            <Text
              style={{
                padding: 10,
                borderWidth: 2,
                textAlign: "center",
                borderColor: "green",
                color: "green", // Fixed: Changed "Color" to "color"
                borderRadius: 10,
                fontSize: 16,
              }}
            >
              Premium: Unlimited access
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={ShowPremiumHandler}
            style={{ marginBottom: 150, marginTop: 20 }}
          >
            <Text
              style={{
                padding: 10,
                borderWidth: 1.5,
                color: "black", // Fixed: Changed "Color" to "color"
                borderRadius: 10,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Try Premium: Unlimited access
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            position: "absolute",
            top: 100,
          }}
        >
          <View
            style={
              {
                // flexDirection: "row",
              }
            }
          >
            <Text>Username:</Text>
            <Text>{userData.username}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text>{userData.firstName}</Text>
            <Text>{userData.lastName}</Text>
          </View>
          {/* //TODO: add function to set darkmode and dispatch state to redux */}
          {/* {userData.darkMode ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.black,
                  fontFamily: "medium",
                }}
              >
                Dark mode
              </Text>
              <TouchableOpacity onPress={toggleDarkMode}>
                <MaterialCommunityIcons
                  name="toggle-switch"
                  size={40}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.black,
                  fontFamily: "medium",
                }}
              >
                Dark mode
              </Text>
              <TouchableOpacity onPress={toggleDarkMode}>
                <MaterialCommunityIcons
                  name="toggle-switch-off-outline"
                  size={40}
                  color="orange"
                />
              </TouchableOpacity>
            </View>
          )} */}
        </View>
      </View>

      <SubmitButton
        title={i18n.t("Logout")}
        onPress={() =>
          Alert.alert(i18n.t("Are you sure you want to logout"), "", [
            {
              text: "Cancel",
              style: "cancel",
            },
            { text: "OK", onPress: () => logoutHandler(userData) },
          ])
        }
        style={{ marginTop: 20, borderRadius: 10 }}
        color={colors.defaultTextColor}
      />
      <Text>
        {i18n.t(
          "Please logout before signing back in to delete your account for security purposes"
        )}
        .
      </Text>
      <SubmitButton
        title={i18n.t("Delete Account")}
        // disabled={!formState.formIsValid}

        onPress={() =>
          Alert.alert(
            i18n.t("Delete Account"),
            i18n.t(
              "Are you sure you want to delete your account all your data will be lost This action is irreversible"
            ),
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: () => deleteAccountHandler(userData.userId),
              },
            ]
          )
        }
        style={{ marginTop: 20, borderRadius: 10 }}
        color={"darkred"}
      />
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => props.navigation.navigate("termsOfService")}
        >
          <Text> {i18n.t("Terms of Service")} -</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("privacyPolicy")}
        >
          <Text> {i18n.t("Privacy policy")} -</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("eula")}>
          <Text> EULA</Text>
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
};

export default AccountSettings;
