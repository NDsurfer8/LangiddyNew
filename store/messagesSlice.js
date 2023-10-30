import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messagesData: {},
    starredMessages: {},
    perPage: 30,
    page: 1,
  },
  reducers: {
    setChatMessages: (state, action) => {
      const existingMessages = state.messagesData;
      const { chatId, messagesData } = action.payload;
      existingMessages[chatId] = messagesData;
      state.messagesData = existingMessages;
    },
    addStarredMessage: (state, action) => {
      const { starredMessageData } = action.payload;
      state.starredMessages[starredMessageData.messageId] = starredMessageData;
    },
    removeStarredMessage: (state, action) => {
      const { messageId } = action.payload;
      delete state.starredMessages[messageId];
    },
    // sets starred messages when app loads   do for phrases too
    setStarredMessages: (state, action) => {
      const { starredMessages } = action.payload;
      state.starredMessages = { ...starredMessages };
    },
    setPerPage: (state, action) => {
      const { perPage } = action.payload;
      state.perPage = perPage;
    },
    setPage: (state, action) => {
      const { page } = action.payload;
      state.page = page;
    },
  },
});
export const setPerPage = messagesSlice.actions.setPerPage;
export const setPage = messagesSlice.actions.setPage;
export const setStarredMessages = messagesSlice.actions.setStarredMessages;
export const addStarredMessage = messagesSlice.actions.addStarredMessage;
export const removeStarredMessage = messagesSlice.actions.removeStarredMessage;
export const setChatMessages = messagesSlice.actions.setChatMessages;
export default messagesSlice.reducer;
