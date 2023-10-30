import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    history: [],
    categories: [],
  },
  reducers: {
    addHistory: (state, action) => {
      state.history.push(action.payload);
      const { item } = action.payload;
      console.log("item", item);

      if (item) {
        state.history.push(item);
      }
    },
    setHistoryItem: (state, action) => {
      // state.history = action.payload;
      const history = action.payload;
      state.history = { ...history };
      // console.log("history", history.phrases);
    },
  },
  setCurrentCategory: (state, action) => {
    // state.categories = action.payload;
    const category = action.payload;
    state.categories = { ...category };
    console.log("category", category);
  },
});
//
// Path: langiddy/store/messagesSlice.js
export const { addPhrase } = historySlice.actions;
export const { addHistory, setHistoryItem, setCurrentCategory } =
  historySlice.actions;
export default historySlice.reducer;
