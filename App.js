import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppNavigator from "./navigation/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { MenuProvider } from "react-native-popup-menu";
import "expo-dev-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnlineStatusListener from "./components/OnlineStatusListener";

// AsyncStorage.clear();
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  //! put this in main navigator

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          bold: require("./assets/fonts/Inter-Bold.ttf"),
          regular: require("./assets/fonts/Inter-Regular.ttf"),
          medium: require("./assets/fonts/Inter-Medium.ttf"),
          semiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <MenuProvider>
          <OnlineStatusListener />
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: "black",
    FontFamily: "regular",
  },
});
