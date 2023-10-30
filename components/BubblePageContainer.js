import { View, StyleSheet, Platform } from "react-native";

const BubblePageContainer = (props) => {
  return <View style={styles.container}>{props.children}</View>;
};
export default BubblePageContainer;
const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: Platform.isPad && 170,
    padding: 0,
    flex: 1,
    backgroundColor: "transparent",
  },
});
