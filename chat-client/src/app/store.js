import { configureStore } from '@reduxjs/toolkit';
import channelReducer from './slices/channelSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    channels: channelReducer,
    user: userReducer,
  },
});
