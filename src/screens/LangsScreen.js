import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import React, { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import PageContainerLangs from "../../components/PageContainerLangs";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";

const LangsScreen = (props) => {
  //pull up all the users that are learning the same language

  const [langs, setLangs] = useState([]);

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);

  const chatId = props.route.params && props.route?.params?.chatId;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!langs) {
      setLangs(langs);
    } else {
      for (const [key, user] of Object.entries(storedUsers)) {
        if (
          user &&
          user.language === userData.language &&
          user.userId !== userData.userId && //? filter out the current user
          user.userId !== userData.selectedUserId //? filter out the user that is already matched with
        )
          setLangs((prevLangs) => prevLangs.concat(user));
      }
    }
  }, [storedUsers.userId]);

  const userPressed = (item) => {
    props.navigation.navigate("Chats", {
      selectedUserId: item,
    });
  };

  return (
    <PageContainerLangs>
      <PageTitle title="Lang" />
      <View style={styles.pagetitleContainer}>
        <Text style={styles.languageText}>
          {(userData.language === "es" && "Spanish") ||
            (userData.language === "fr" && "French") ||
            (userData.language === "de" && "German") ||
            (userData.language === "it" && "Italian") ||
            (userData.language === "pt" && "Portuguese") ||
            (userData.language === "ru" && "Russian") ||
            (userData.language === "zh" && "Chinese") ||
            (userData.language === "ja" && "Japanese") ||
            (userData.language === "ko" && "Korean") ||
            (userData.language === "ar" && "Arabic") ||
            (userData.language === "hi" && "Hindi") ||
            (userData.language === "bn" && "Bengali") ||
            (userData.language === "pa" && "Punjabi") ||
            (userData.language === "vi" && "Vietnamese") ||
            (userData.language === "id" && "Indonesian") ||
            (userData.language === "ms" && "Malay") ||
            (userData.language === "th" && "Thai") ||
            (userData.language === "tr" && "Turkish") ||
            (userData.language === "ur" && "Urdu") ||
            (userData.language === "el" && "Greek") ||
            (userData.language === "he" && "Hebrew") ||
            (userData.language === "pl" && "Polish") ||
            (userData.language === "ro" && "Romanian") ||
            (userData.language === "uk" && "Ukrainian") ||
            (userData.language === "bg" && "Bulgarian") ||
            (userData.language === "cs" && "Czech") ||
            (userData.language === "da" && "Danish") ||
            (userData.language === "et" && "Estonian") ||
            (userData.language === "fi" && "Finnish") ||
            (userData.language === "hu" && "Hungarian") ||
            (userData.language === "lt" && "Lithuanian") ||
            (userData.language === "lv" && "Latvian") ||
            (userData.language === "sk" && "Slovak") ||
            (userData.language === "sl" && "Slovenian") ||
            (userData.language === "sw" && "Swahili") ||
            (userData.language === "tl" && "Tagalog") ||
            (userData.language === "af" && "Afrikaans") ||
            (userData.language === "am" && "Amharic")}
        </Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => props.navigation.navigate("findLangs")}
        >
          <Text style={styles.findLangsButton}>find langs</Text>
        </TouchableOpacity>
      </View>
      {langs.length > 0 ? (
        <FlatList
          data={langs
            .filter(
              (user) =>
                user &&
                user.language === userData.language &&
                user.languageFrom === userData.languageFrom &&
                user.userId !== userData.userId && //? filter out the current user
                user.userId !== userData.selectedUserId //? filter out the user that is already matched with
            )
            .sort(() => Math.random() - 0.5)}
          keyExtractor={(item) => item.userId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            console.log("item", item.userId);
            const { firstName, lastName, language, about, profilePic, userId } =
              item;

            return (
              <View style={styles.personContainer}>
                <View style={styles.imageSpace}>
                  <TouchableOpacity onPress={() => userPressed(item.userId)}>
                    <Image
                      style={styles.image}
                      source={{
                        uri: profilePic,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.nameText}>
                  {firstName} {lastName}
                </Text>
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.noLangs}>
          <Text style={styles.noLangsText}>
            Need to find people to add to your lang
          </Text>
          <Entypo name="emoji-sad" size={50} color={colors.grey} />
        </View>
      )}
    </PageContainerLangs>
  );
};

export default LangsScreen;
const styles = StyleSheet.create({
  personContainer: {
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    borderRadius: 30,
    backgroundColor: "white",
    height: 300,
    width: "100%",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "100%",
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
  },
  nameText: {
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    color: colors.orange,
    opacity: 0.8,
    marginTop: 10,
    paddingLeft: 20,
    marginRight: 200,
    position: "absolute",
  },
  imageSpace: {
    width: "100%",
    height: 300,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 20,
  },
  headerButton: {
    marginRight: 20,
  },
  pagetitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  findLangsButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.orange,
    marginLeft: "60%",
  },
  languageText: {
    fontSize: 20,
    fontWeight: "regular",
    color: colors.defaultTextColor,
  },
});

{
  /* <View style={styles.buttons}>
<TouchableOpacity
  style={styles.closeButton}
  onPress={() => onPass(item.userId)}
>
  <AntDesign
    name="minuscircle"
    size={50}
    color={colors.grey}
  />
</TouchableOpacity>
<TouchableOpacity
  style={styles.closeButton}
  onPress={() => userPressed(item.userId)}
>
  <AntDesign
    name="pluscircle"
    size={50}
    color={colors.orange}
  />
</TouchableOpacity>
</View> */
}
