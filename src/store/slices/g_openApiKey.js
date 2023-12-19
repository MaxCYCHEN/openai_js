import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const g_openApiKey = createSlice({
    name: "g_openApiKey",
    initialState,
    reducers: {
        setOpenApiKey(state, action) {
            state = action.payload;
            return state;
        }
    }
});

export const { setOpenApiKey } = g_openApiKey.actions;
export default g_openApiKey.reducer;
