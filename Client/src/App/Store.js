import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../Features/Auth/AuthSlice";
import SocketReducer from "../Features/Socket/SocketSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    socket: SocketReducer,
  },
});
