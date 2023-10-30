import { View, StyleSheet } from "react-native";

const PageContainerLangs = (props) => {
  return <View style={styles.container}>{props.children}</View>;
};
export default PageContainerLangs;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.isPad ? 170 : 20,
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
});
