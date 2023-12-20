import { useSelector, Provider } from 'react-redux';
import { Input, Button } from 'antd';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

import store from "./store";
import ApiKey from "./components/apiKey";
import DraggerUpload from "./components/draggerUpload";
import Question from "./components/question";

import './App.css';

function App() {
  const g_openApiKey = useSelector((state) => state.g_openApiKey);
  const g_fileListResult = useSelector((state) => state.g_fileListResult);
  const g_question = useSelector((state) => state.g_question);

  var onSubmit = async (_openApiKey, _content) => {
    const llm = new OpenAI({
      openAIApiKey: _openApiKey,
      temperature: 0.9,
    });
    
    const chatModel = new ChatOpenAI();
    
    const text = _content;
      // "What would be a good company name for a company that makes colorful socks?";
    
    const llmResult = await llm.predict(text);
    /*
      "Feetful of Fun"
    */
    
    const chatModelResult = await chatModel.predict(text);
  };

  var tmp = Object.values(g_fileListResult);
  if( tmp.length === 0){
    tmp = g_question;
  }
  else {
    tmp.push(g_question);
    tmp = tmp.join("\n;;\n");
  }

  return (
      <div className="App">
        <Provider store={store}>
          <ApiKey/>
          <DraggerUpload/>
          <Question/>
          <Button
            type="primary"
            style={{marginTop:20}}
            onClick={() => onSubmit(g_openApiKey, tmp)}
          >
            Submit
          </Button>
        </Provider>

        <p> Combined Question: </p>
        <Input.TextArea
          value={tmp}
          autoSize={true}
        />
      </div>
  );
}

export default App;
