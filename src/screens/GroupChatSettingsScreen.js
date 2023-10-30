import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import { ScrollView } from "react-native-gesture-handler";
import ProfileImage from "../../components/ProfileImage";
import Input from "../../components/Input";
import { validateLength } from "../../utils/validationConstraints";
import { reducer } from "../../utils/reducers/formReducer";
import {
  addUsersToChat,
  removeUserFromChat,
  updateChatData,
} from "../../utils/actions/chatActions";
import SubmitButton from "../../components/SubmitButton";
import colors from "../../constants/colors";
import DataItem from "../../components/DataItem";

const GroupChatSettingsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatId = props.route.params.chatId;
  const chatData = useSelector((state) => state.chats.chatsData[chatId] || {});
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const dispatch = useDispatch();
  const initialState = {
    inputValues: {
      chatName: chatData.chatName,
    },
    inputValidities: {
      chatName: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const selectedUsers = props.route.params && props.route.params.selectedUsers;
  useEffect(() => {
    if (!selectedUsers) return;
    const selectedUsersData = [];
    selectedUsers.forEach((uid) => {
      if (uid === userData.userId) return;
      if (!storedUsers[uid]) return;
      selectedUsersData.push(storedUsers[uid]);
    });
    // console.log("selectedUsersData", selectedUsersData);
    addUsersToChat(userData, selectedUsersData, chatData);
  }, [selectedUsers]);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateLength(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateChatData(chatId, userData.userId, updatedValues);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [formState.inputValues]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.chatName != chatData.chatName;
  };

  const leaveChat = useCallback(async () => {
    try {
      setIsLoading(true);
      //remove user from chat
      await removeUserFromChat(userData, userData, chatData);
      setIsLoading(false);
      props.navigation.popToTop();
    } catch (err) {
      console.log(err);
    }
  }, [props.navigation, isLoading]);

  if (!chatData.users) return null;

  return (
    <PageContainer>
      <SafeAreaView style={styles.container}>
        <PageTitle title="Group chat" />
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <ProfileImage
            showEditButton={true}
            size={120}
            chatId={chatId}
            userId={userData.userId}
            uri={chatData.chatImage}
          />
          <View style={styles.inputContainer}>
            <Input
              id="chatName"
              label="Group Chat Name"
              initialValue={chatData.chatName}
              allowEmpty={false}
              autoCapitalize="none"
              styles={styles.input}
              onInputChanged={inputChangedHandler}
              errorText="Chat name must be at least 3 characters long"
            />
            <View style={styles.sectionContainer}>
              <Text style={styles.textParticipants}>
                {chatData.users.length} Participants
              </Text>
              <DataItem
                title="Add users"
                icon="plus"
                onPress={() =>
                  props.navigation.navigate("NewChat", {
                    isGroupChat: true,
                    existingUsers: chatData.users,
                    chatId: chatId,
                  })
                }
              />
              {chatData.users.slice(0, 8).map((user) => {
                const currentUser = storedUsers[user];
                return (
                  <DataItem
                    key={user}
                    title={
                      currentUser.firstName || currentUser.lastName
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : currentUser.firstLast
                    }
                    image={currentUser.profilePic}
                    subTitle={currentUser.about}
                    type={user !== userData.userId && "link"}
                    onPress={() =>
                      user !== userData.userId &&
                      props.navigation.navigate("ContactPage", {
                        uid: user,
                        chatId: chatId,
                      })
                    }
                  />
                );
              })}
              {chatData.users.length > 8 && (
                <DataItem
                  type="link"
                  title="View all participants"
                  onPress={() =>
                    props.navigation.navigate("AllParticipants", {
                      title: "Participants",
                      data: chatData.users,
                      type: "users",
                      chatId: chatId,
                    })
                  }
                  hideImage={true}
                />
              )}
            </View>

            {isLoading ? (
              <View>
                <ActivityIndicator size="small" color="black" />
              </View>
            ) : (
              <View>
                <SubmitButton
                  title="Save"
                  color={colors.orange}
                  onPress={saveHandler}
                  disabled={!formState.formIsValid || !hasChanges()}
                />
              </View>
            )}
            {showSuccessMessage && (
              <View>
                <Text>Changes saved successfully</Text>
              </View>
            )}
          </View>
        </ScrollView>
        {
          <SubmitButton
            title="Leave chat"
            color={colors.orange}
            onPress={() => leaveChat()}
            style={{ marginVertical: 5 }}
          />
        }
      </SafeAreaView>
    </PageContainer>
  );
};

export default GroupChatSettingsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileImage: {
    marginTop: 20,
  },
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  input: {
    width: "80%",
    marginVertical: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  inputContainer: {
    width: "100%",
    marginVertical: 20,
  },
  sectionContainer: {
    marginVertical: 10,
    width: "100%",
  },
  textParticipants: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "bold",
    color: colors.defaultTextColor,
    letterSpacing: 0.5,
  },
});
