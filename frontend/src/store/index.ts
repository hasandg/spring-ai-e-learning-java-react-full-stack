import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import authReducer from './slices/authSlice';

// Create logger middleware
const loggerMiddleware = createLogger({
  collapsed: true,
  // Only log in development
  predicate: () => process.env.NODE_ENV !== 'production',
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in actions (examples)
        ignoredActions: ['auth/login/fulfilled', 'auth/login/rejected'],
        ignoredPaths: ['auth.user.token'],
      },
    }).concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 