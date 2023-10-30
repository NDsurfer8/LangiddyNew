import React, { useState, useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Button,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../../components/CustomHeaderButton";
import PageContainer from "../../components/PageContainer";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { searchUsers } from "../../utils/actions/userActions";
import DataItem from "../../components/DataItem";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setStoredUsers } from "../../store/userSlice";
import ProfileImage from "../../components/ProfileImage";
import ProfileImageNonCached from "../../components/ProfileImageNonCached";
import MainProfilePic from "../../components/MainProfilePic";
import ImageSettingsHelper from "../../components/ImageSettingsHelper";

const NewChatScreen = (props) => {
  const dispatch = useDispatch();
  //Screen for where we search for a new user to send a new message
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [users, setUsers] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const isGroupChat = props.route?.params?.isGroupChat;
  const isGroupChatDisabled =
    selectedUsers.length === 0 || (isNewChat && chatName === "");
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const selectedUsersFlatList = useRef();
  const chatId = props.route.params && props.route?.params?.chatId;
  const existingUsers =
    props.route.params && props.route?.params?.existingUsers;

  const isNewChat = !chatId;

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </HeaderButtons>
        );
      },

      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {isGroupChat && (
              <Item
                title={isNewChat ? "Create" : "Add"}
                disabled={isGroupChatDisabled}
                color={isGroupChatDisabled ? colors.grey : colors.orange}
                onPress={() => {
                  const screenName = isNewChat ? "Chats" : "GroupChatSettings";
                  props.navigation.navigate(screenName, {
                    selectedUsers,
                    chatName,
                    chatId,
                  });
                }}
              />
            )}
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? "Group Chat" : "New Chat",
    });
  }, [chatName, selectedUsers]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers();
        setNoResults(false);
        return;
      }
      setIsLoading(true);
      const userResult = await searchUsers(searchTerm);
      // allows for the logged in user not to show in search results
      delete userResult[userData.userId];
      setUsers(userResult);
      if (Object.keys(userResult).length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        dispatch(setStoredUsers({ newUsers: userResult }));
      }

      setIsLoading(false);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const userPressed = (userId) => {
    if (isGroupChat) {
      const newSelectedUsers = selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : selectedUsers.concat(userId);

      setSelectedUsers(newSelectedUsers);
    } else {
      props.navigation.navigate("Chats", {
        selectedUserId: userId,
      });
    }
  };

  return (
    <PageContainer>
      {isNewChat && isGroupChat && (
        <View style={styles.chatNameContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textbox}
              placeholder="Enter a name for your group chat"
              autoCorrect={false}
              autoComplete="off"
              onChangeText={(text) => setChatName(text)}
            />
          </View>
        </View>
      )}

      {isGroupChat && (
        <View style={styles.selectedUsersContainer}>
          <FlatList
            style={styles.selectedUsersList}
            data={selectedUsers}
            horizontal={true}
            keyExtractor={(item) => item}
            contentContainerStyle={{ alignItems: "center" }}
            ref={(ref) => (selectedUsersFlatList.current = ref)}
            onContentSizeChange={() =>
              selectedUsers.length > 0 &&
              selectedUsersFlatList.current.scrollToEnd()
            }
            renderItem={(itemData) => {
              const userId = itemData.item;
              const userData = storedUsers[userId];
              return (
                <View
                  style={{
                    marginRight: 10,
                    alignItems: "center",
                  }}
                >
                  {userData.profilePic ? (
                    <MainProfilePic
                      style={styles.selectedUserStyle}
                      size={40}
                      uri={userData.profilePic}
                      onPress={() => userPressed(userId)}
                      showRemoveButton={true}
                    />
                  ) : (
                    <ImageSettingsHelper
                      style={styles.selectedUserStyle}
                      size={40}
                      uri={userData.profilePic}
                      onPress={() => userPressed(userId)}
                      showRemoveButton={true}
                    />
                  )}
                </View>
              );
            }}
          />
        </View>
      )}

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={24} color={colors.orange} />
        <TextInput
          placeholder="Search user by name or username"
          style={styles.searchBox}
          autoCorrect={false}
          autoComplete="off"
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      {isLoading && (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <FontAwesome
            name="spinner"
            size={55}
            color="grey"
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>Searching...</Text>
        </View>
      )}

      {!isLoading && !noResults && users && (
        <FlatList
          data={Object.keys(users)}
          // keyExtractor={(userId) => userId}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];
            if (existingUsers && existingUsers.includes(userId)) {
              return;
            }
            return (
              <DataItem
                title={
                  userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.firstLast
                }
                subTitle={userData.about}
                onPress={() => userPressed(userId)}
                image={userData.profilePic}
                type={isGroupChat ? "checkBox" : ""}
                isChecked={selectedUsers.includes(userId)}
              />
            );
          }}
        />
      )}

      {!isLoading && !users && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginBottom: 0,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginBottom: 0,
            }}
          >
            {/* <Text
              style={{
                fontSize: 18,
                fontFamily: "regular",
                color: "black",
                marginBottom: 10,
              }}
            >
              want to chat with a friend not on langiddy?
            </Text> */}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("contacts");
              }}
              style={{
                marginBottom: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "orange",
                  marginBottom: 10,
                  left: 0,
                }}
              >
                Invite Friends from Contacts
              </Text>
            </TouchableOpacity>
            <FontAwesome
              name="users"
              size={55}
              color="grey"
              style={styles.noResultsIcon}
            />
            <Text style={styles.noResultsText}>
              Please search the name or username of the person you would like to
              start a chat with.
            </Text>
          </View>
          <View></View>
        </View>
      )}
      {
        // No results found
        !isLoading && noResults && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginBottom: 0,
            }}
          >
            <FontAwesome
              name="question-circle"
              size={55}
              color="grey"
              style={styles.noResultsIcon}
            />
            <Text style={styles.noResultsText}>No users found</Text>
          </View>
        )
      }
    </PageContainer>
  );
};

export default NewChatScreen;
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGrey,
    padding: 10,
    borderRadius: 20,
    margin: 10,
    borderBottomEndRadius: 0,
  },
  searchBox: {
    marginLeft: 10,
    width: "90%",
  },
  noResultsIcon: {
    margin: 10,
  },
  noResultsText: {
    color: colors.defaultTextColor,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "regular",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGrey,
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  userImageOverlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  userImageText: {
    color: "white",
    fontSize: 20,
    fontFamily: "bold",
  },
  chatNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.nearlyWhite,
    padding: 10,
    borderRadius: 2,
    margin: 10,
  },
  inputContainer: {
    width: "100%",
    height: 50,
  },
  chatBox: {
    width: "100%",
    fontSize: 18,
    fontFamily: "regular",
  },
  selectedUsersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 2,
  },
  selectedUsersList: {
    width: "100%",
    height: 50,
  },
  selectedUserImage: {
    marginRight: 10,
    padding: 5,
  },
  selectedUsersListContent: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textbox: {
    flex: 1,
    width: "100%",
    fontSize: 17,
    fontFamily: "regular",
  },
  selectedUserStyle: {
    marginRight: 10,
    padding: 5,
  },
});
