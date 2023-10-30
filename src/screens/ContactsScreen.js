import { View, Text } from "react-native";
import React from "react";
import InviteFriends from "../../components/InviteFriends";
import { useSelector } from "react-redux";

const ContactsScreen = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  return (
    <View>
      <InviteFriends userData={userData} />
    </View>
  );
};

export default ContactsScreen;
