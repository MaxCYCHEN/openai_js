import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const g_combinedQuestion = createSlice({
    name: "g_combinedQuestion",
    initialState,
    reducers: {
        setCombinedQuestion(state, action) {
            state = action.payload;
            return state;
        }
    }
});

export const { setCombinedQuestion } = g_combinedQuestion.actions;
export default g_combinedQuestion.reducer;
