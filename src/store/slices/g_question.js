import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const g_question = createSlice({
    name: "g_question",
    initialState,
    reducers: {
        setQuestion(state, action) {
            state = action.payload;
            return state;
        }
    }
});

export const { setQuestion } = g_question.actions;
export default g_question.reducer;
