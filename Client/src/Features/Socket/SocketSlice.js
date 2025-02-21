import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
  message: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    addMessage(state, action) {
      state.message.push(action.payload);
    },
    removeMessagesByIds(state, action) {
      const idsToRemove = action.payload;
      state.message = state.message.filter(
        (msg) => !idsToRemove.includes(msg._id)
      );
    },
  },
});

export const { setOnlineUsers, addMessage, removeMessagesByIds } =
  socketSlice.actions;
export default socketSlice.reducer;
