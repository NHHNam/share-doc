import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: {}
};

export const fileSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
        }
    }
});

export const { setUser } = fileSlice.actions;

export default fileSlice.reducer;
