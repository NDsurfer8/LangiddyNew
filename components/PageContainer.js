import { View, StyleSheet, Platform } from "react-native";

const PageContainer = (props) => {
  const { darkMode } = props;
  return (
    <View style={[styles.container, darkMode && styles.darkModeContainer]}>
      {props.children}
    </View>
  );
};
export default PageContainer;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.isPad ? 170 : 20,
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  darkModeContainer: {
    backgroundColor: "#121212",
  },
});
