import {
  child,
  getDatabase,
  push,
  ref,
  set,
  update,
  query,
  orderByChild,
  orderByKey,
  startAt,
  limitToLast,
  equalTo,
  onValue,
  off,
  get,
  remove,
} from "firebase/database";
import { getFirebase } from "../firebaseHelper";
import { getUserPushTokens } from "./authActions";
import { addUserChat, deleteUserChat, getUserChats } from "./userActions";
import { useSelector } from "react-redux";

export const createChat = async (loggedInUserId, chatData) => {
  const newChatData = {
    ...chatData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    receiverHasRead: false,
  };

  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const newChat = await push(child(dbRef, "chats"), newChatData);

  const chatUsers = newChatData.users;
  console.log("chatUsersNew", chatUsers);
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `userChats/${userId}`), newChat.key);
  }

  return newChat.key;
};

export const clickedChatWhereNotSender = async (loggedInUserId, chatId) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const chatRef = await child(dbRef, `chats/${chatId}`);
  const chatData = await get(chatRef);
  const chat = chatData.val();
  console.log("chat", chat);
  if (chat.updatedBy !== loggedInUserId) {
    await update(chatRef, {
      receiverHasRead: true,
    });
  }
};

export const sendTextMessage = async (
  chatId,
  loggedInUserId,
  messageText,
  translation,
  from,
  to,
  replyTo,
  chatUsers
) => {
  await sendMessage(
    chatId,
    loggedInUserId.userId,
    messageText,
    translation,
    from,
    to,
    null,
    replyTo
  );
  const otherUsers = chatUsers.filter((user) => user !== loggedInUserId.userId);

  await sendPushNotification(
    otherUsers,
    `${loggedInUserId.firstLast} `,
    messageText ? messageText : translation,
    chatId
  );
};

export const sendInfoMessage = async (chatId, loggedInUserId, messageText) => {
  await sendMessage(
    chatId,
    loggedInUserId,
    messageText,
    null,
    null,
    null,
    null,
    null,
    "info"
  );
};
//works great
export const sendImage = async (
  chatId,
  loggedInUserId,
  imageUrl,
  replyTo,
  chatUsers
) => {
  await sendMessage(
    chatId,
    loggedInUserId.userId,
    null,
    null,
    null,
    null,
    imageUrl,
    replyTo
  );

  const otherUsers = chatUsers.filter((user) => user !== loggedInUserId.userId);

  await sendPushNotification(
    otherUsers,
    `${loggedInUserId.firstLast} `,
    "Sent an image",
    chatId
  );
};

export const sendMessage = async (
  chatId,
  loggedInUserId,
  messageText,
  translation,
  from,
  to,
  imageUrl,
  replyTo,
  type
) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const messageRef = child(dbRef, `messages/${chatId}`);

  // creates the message object
  const serverTime = {
    ".sv": "timestamp",
  };

  const messageData = {
    sentBy: loggedInUserId,
    sentAt: new Date().toISOString(),
  };
  if (replyTo) {
    messageData.replyTo = replyTo;
  }
  if (imageUrl) {
    messageData.imageUrl = imageUrl;
  }
  if (messageText) {
    messageData.text = messageText;
  }
  if (type) {
    messageData.type = type;
  }
  if (from) {
    messageData.from = from;
  }
  if (to) {
    messageData.to = to;
  }

  // pushes the message to the database
  const newMessageRef = await push(messageRef, messageData);

  // retrieve the generated message ID
  const messageId = newMessageRef.key;

  const chatRef = child(dbRef, `chats/${chatId}`);
  // updates the chat with the latest message
  await update(chatRef, {
    updatedAt: new Date().toISOString(),
    updatedBy: loggedInUserId,
    latestMessageText: messageText ? messageText : translation,
    latestMessageTranslation: translation,
  });

  // If translation is provided, update the previous message with translation
  if (translation) {
    const previousMessageId = messageId;
    const previousMessageRef = child(messageRef, previousMessageId.toString());
    await update(previousMessageRef, {
      translation: translation,
      from: from || "",
      to: to || "",
    });
  }

  return messageId;
};

export const updateChatData = async (chatId, userId, chatData) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `chats/${chatId}`);
  const serverTime = {
    ".sv": "timestamp",
  };
  await update(chatRef, {
    ...chatData,
    updatedBy: userId,
    updatedAt: new Date().toISOString(),
  });
};

export const removeUserFromChat = async (
  userLoggedInData,
  userToRemoveData,
  chatData
) => {
  const userToRemoveId = userToRemoveData.userId;
  const newUsers = chatData.users.filter((uid) => uid !== userToRemoveId);
  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: newUsers,
  });
  const userChats = await getUserChats(userToRemoveId);
  for (const key in userChats) {
    const currentChatId = userChats[key];
    if (currentChatId === chatData.key) {
      await deleteUserChat(userToRemoveId, key);
      break;
    }
  }
  const messageText =
    userLoggedInData.userId === userToRemoveData.userId
      ? `${userLoggedInData.firstName} left the chat`
      : `${userLoggedInData.firstName} removed ${userToRemoveData.firstLast} from the chat`;
  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};

export const addUsersToChat = async (
  userLoggedInData,
  usersToAddData,
  chatData
) => {
  const existingUsers = Object.values(chatData.users);
  const newUsers = [];

  let userAddedName = "";

  usersToAddData.forEach(async (userToAdd) => {
    const userToAddId = userToAdd.userId;

    if (existingUsers.includes(userToAddId)) return;

    newUsers.push(userToAddId);

    await addUserChat(userToAddId, chatData.key);

    userAddedName = `${userToAdd.firstLast}`;
  });

  if (newUsers.length === 0) {
    return;
  }

  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: existingUsers.concat(newUsers),
  });

  const moreUsersMessage =
    newUsers.length > 1 ? `and ${newUsers.length - 1} others ` : "";
  const messageText = `${userLoggedInData.firstName} ${userLoggedInData.lastName} added ${userAddedName} ${moreUsersMessage}to the chat`;
  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};

// tells database that a users has matched with another user is alerted when a user has matched with them

// delete the chat only from the users that is deleteing the chat
export const deleteChat = async (userId, chatId) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `userChats/${userId}/${chatId}`);
  // const chatRef2 = child(dbRef, `chats/${chatId}`);

  await remove(chatRef);

  // await remove(chatRef2);

  await deleteUserChat(userId, chatId);
  //! all new after this  allows to clear the chat after it has been deleted
  const userChats = await getUserChats(userId);
  for (const key in userChats) {
    const currentChatId = userChats[key];
    // added this to make sure that the chat is deleted from the user
    if (currentChatId === chatId) {
      await deleteUserChat(userId, key);
      break;
    }
  }

  return true;
};
// I added sound: "default" to the body of and now sound is working
// adding badge: 1 to the body of the push notification will add a badge to the app icon
// get receiverHasRead.

const sendPushNotification = async (chatUsers, title, body, chatId) => {
  chatUsers.forEach(async (uid) => {
    const tokens = await getUserPushTokens(uid);
    for (const key in tokens) {
      const token = tokens[key];
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          to: token,
          title: title,
          body: body,
          sound: "default",
          badge: 1,
          vibrate: true,
          data: { chatId: chatId },
        }),
      });
    }
  });
};

// block this user from seding messages to this person

export const blockUserFromChatting = async (
  userLoggedInData,
  userToBlockData
) => {
  const userLoggedInId = userLoggedInData.userId;
  const userToBlockId = userToBlockData.userId;

  const app = getFirebase();
  const dbRef = ref(getDatabase(app));

  // Create or update the blockedByUsers object for the user being blocked
  await set(
    child(dbRef, `users/${userToBlockId}/blockedByUsers/${userLoggedInId}`),
    true
  );

  // Create or update the blockedUsers object for the user who is blocking
  await set(
    child(dbRef, `users/${userLoggedInId}/blockedUsers/${userToBlockId}`),
    true
  );
};

export const unblockUserFromChatting = async (
  userLoggedInData,
  userToUnblockData
) => {
  const userLoggedInId = userLoggedInData.userId;
  const userToUnblockId = userToUnblockData.userId;

  const app = getFirebase();
  const dbRef = ref(getDatabase(app));

  // Remove the blockedByUsers entry for the user being unblocked
  await remove(
    child(dbRef, `users/${userToUnblockId}/blockedByUsers/${userLoggedInId}`)
  );

  // Remove the blockedUsers entry for the user who is unblocking
  await remove(
    child(dbRef, `users/${userLoggedInId}/blockedUsers/${userToUnblockId}`)
  );
};

const checkIfBlocked = async (userLoggedInId, userToCheckId) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const blockedByUsersRef = child(
    dbRef,
    `users/${userToCheckId}/blockedByUsers`
  );
  const blockedByUsersSnapshot = await get(blockedByUsersRef);

  return blockedByUsersSnapshot.hasChild(userLoggedInId);
};

// export const blockUserFromChatting = async (
//   userLoggedInData,
//   userToBlockData
// ) => {
//   const userLoggedInId = userLoggedInData.userId;
//   const userToBlockId = userToBlockData.userId;

//   const app = getFirebase();
//   const dbRef = ref(getDatabase(app));
//   const userRef = child(dbRef, `users/${userLoggedInId}/blockedUsers`);
//   const blockedUserRef = child(dbRef, `users/${userToBlockId}/blockedByUsers`);

//   // Check if the user is already blocked before adding to the list
//   const userBlocked = await get(child(userRef, userToBlockId));
//   const blockedByUser = await get(child(blockedUserRef, userLoggedInId));

//   if (!userBlocked.exists() && !blockedByUser.exists()) {
//     await set(userRef, { [userToBlockId]: true });
//     await set(blockedUserRef, { [userLoggedInId]: true });
//   }
// };

// export const updateMessageTranslation = async (
//   chatId,
//   messageId,
//   translation,
//   from,
//   to,
//   messageText
// ) => {
//   try {
//     // get the message id from the chat id for the message that needs to be updated
//     console.log("hello");
//     if (typeof translation === "undefined") {
//       console.log("Translation is undefined");
//       return;
//     }

//     const app = getFirebase();
//     const dbRef = ref(getDatabase(app));
//     const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

//     // Update the message with the translation
//     console.log("translation: ", translation);
//     await update(messageRef, {
//       translation: translation,
//       from: from,
//       to: to,
//       messageText: messageText,
//     });

//     console.log("Message translation updated successfully");
//   } catch (error) {
//     console.log("Error updating message translation", error);
//   }
// };
export const updateMessageTranslation = async (
  chatId,
  messageId,
  translation,
  from,
  to,
  messageText
) => {
  try {
    if (typeof translation === "undefined") {
      console.log("Translation is undefined");
      return;
    }

    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

    // Create an object to hold the properties to update
    const updateObject = {};

    // Add properties to the updateObject only if they are defined
    if (translation !== undefined) {
      updateObject.translation = translation;
    }
    if (from !== undefined) {
      updateObject.from = from;
    }
    if (to !== undefined) {
      updateObject.to = to;
    }
    if (messageText !== undefined) {
      updateObject.messageText = messageText;
    }

    // Update the message with the properties from the updateObject
    await update(messageRef, updateObject);

    console.log("Message translation updated successfully");
  } catch (error) {
    console.log("Error updating message translation", error);
  }
};

export const getLatestMessageIds = async (chatId) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const messageRef = child(dbRef, `messages/${chatId}`);

  try {
    const snapshot = await get(messageRef);
    if (snapshot.exists()) {
      const messageIds = Object.keys(snapshot.val()).sort().reverse();
      return messageIds;
    }
  } catch (error) {
    console.log("Error retrieving latest message IDs", error);
  }

  return [];
};

export const getMessageData = async (messageId) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

    const snapshot = await get(messageRef);
    if (snapshot.exists()) {
      const messageData = snapshot.val();
      return messageData;
    }
  } catch (error) {
    console.log("Error retrieving message data", error);
  }

  return null;
};

export const getMessageById = async (chatId, messageId) => {
  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

    const snapshot = await get(messageRef);
    if (snapshot.exists()) {
      const messageData = snapshot.val();
      return messageData;
    }
  } catch (error) {
    console.log("Error retrieving message data", error);
  }

  return null;
};
//! Pagination keep working on
export const loadMoreMessages = async (chatId, currentPage) => {
  const messagesPerPage = 10; // Define the number of messages to load per page

  try {
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const messageRef = child(dbRef, `messages/${chatId}`);
    const startAtKey = String((currentPage - 1) * messagesPerPage); // Convert startAtKey to a string

    // Fetch the messages from the database using the appropriate query
    const snapshot = await get(
      query(
        messageRef,
        orderByKey(),
        startAt(startAtKey),
        limitToLast(messagesPerPage)
      )
    );

    const messages = [];
    snapshot.forEach((childSnapshot) => {
      const messageId = childSnapshot.key;
      const messageData = childSnapshot.val();
      messages.push({ id: messageId, ...messageData });
    });

    // Reverse the order of the messages to display them in chronological order
    const reversedMessages = messages.reverse();

    // Update the UI with the newly loaded messages
    // Implement your logic here to append the messages to the existing messages list

    return reversedMessages;
  } catch (error) {
    console.log("Error loading more messages", error);
    return [];
  }
};
