import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const g_fileListResult = createSlice({
    name: "g_fileListResult",
    initialState,
    reducers: {
        setFileListResult(state, action) {
            state = action.payload;
            return state;
        }
    }
});

export const { setFileListResult } = g_fileListResult.actions;
export default g_fileListResult.reducer;
