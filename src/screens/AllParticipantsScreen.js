import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import PageContainer from "../../components/PageContainer";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import DataItem from "../../components/DataItem";

const AllParticipantsScreen = (props) => {
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const { title, data, type, chatId } = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: title,
    });
  }, [title]);

  return (
    <PageContainer>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        renderItem={(itemData) => {
          let key, onPress, image, title, subtitle, itemType;

          if (type === "users") {
            const uid = itemData.item;
            const currentUser = storedUsers[uid];
            if (!currentUser) {
              return;
            }
            const isLoggedInUser = uid === userData.userId;

            key = uid;
            image = currentUser.profilePic;
            title = currentUser.firstName + " " + currentUser.lastName;
            subtitle = currentUser.about;
            itemType = isLoggedInUser ? undefined : "link";
            onPress = isLoggedInUser
              ? undefined
              : () =>
                  props.navigation.navigate("ContactPage", {
                    uid: key,
                    chatId,
                  });
          }
          return (
            <DataItem
              key={key}
              onPress={onPress}
              image={image}
              title={title}
              subtitle={subtitle}
              type={itemType}
            />
          );
        }}
      />
    </PageContainer>
  );
};

export default AllParticipantsScreen;
const styles = StyleSheet.create({});
