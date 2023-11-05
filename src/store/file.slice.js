import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentFile: {},
    listFile: [],
    comments: [],
    listFileOfUSer: []
};

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setFile: (state, action) => {
            state.currentFile = action.payload;
        },
        setListFile: (state, action) => {
            state.listFile = action.payload;
        },
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        setListFilesOfUSer: (state, action) => {
            state.listFileOfUSer = action.payload;
        }
    }
});

export const { setFile, setListFile, setComments, setListFilesOfUSer } =
    fileSlice.actions;

export default fileSlice.reducer;
