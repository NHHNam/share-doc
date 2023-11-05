import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user.slice';
import fileReducer from './file.slice';

const store = configureStore({
    reducer: {
        user: userReducer,
        file: fileReducer
    }
});

export default store;
