import { useSelector, Provider } from 'react-redux';
import { Input, Button, Modal  } from 'antd';

import store from "./store";
import ApiKey from "./components/apiKey";
import DraggerUpload from "./components/draggerUpload";
import Question from "./components/question";

import './App.css';

setTimeout(()=> {
	window.api.electron_receive((event, type, data) => {
    Modal.info({
      title: "Response",
      content: data.text,
      centered: true,
    })
  })
}, 1000);

function App() {
  const g_openApiKey = useSelector((state) => state.g_openApiKey);
  const g_fileListResult = useSelector((state) => state.g_fileListResult);
  const g_question = useSelector((state) => state.g_question);

  var onSubmit = async (_openApiKey, _content) => {
    let key = _openApiKey || "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";
    let dir = "TRM_M463_M467_Series_EN_Rev1.01_openai";
    let template = `Use the following pieces of context and chat history to answer the question. 
    The context is Nuvoton M467 Series Technical Reference Manual. 
    If you don't know the answer or the question has nothing to do with code or programing, don't try to make up an answer.
    ----------
    Context: {context}
    ----------
    Chat History: {chat_history}
    ----------
    Question: {question}
    ----------
    Your answer:`;

    try{
      await window.api.electron_openai(key, dir, template, _content);
    }
    catch(e){
      console.error(e);
    }
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
