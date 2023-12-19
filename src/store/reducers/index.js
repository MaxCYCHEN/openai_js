import { combineReducers } from "redux";
import g_openApiKey from "../slices/g_openApiKey";
import g_fileListResult from "../slices/g_fileListResult";
import g_question from "../slices/g_question";
import g_combinedQuestion from "../slices/g_combinedQuestion";


const reducers = combineReducers({
  g_openApiKey,
  g_fileListResult,
  g_question,
  g_combinedQuestion,
});

export default reducers;