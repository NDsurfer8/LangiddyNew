import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chatsData: {},
  },
  reducers: {
    setChatsData: (state, action) => {
      // reloads the chatsData object with the new data
      state.chatsData = { ...action.payload.chatsData };
    },
  },
});
export const setChatsData = chatSlice.actions.setChatsData;
export default chatSlice.reducer;
