import { configureStore } from '@reduxjs/toolkit';
import urlReducer from './urlSlice';

export const store = configureStore({
  reducer: {
    url: urlReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
