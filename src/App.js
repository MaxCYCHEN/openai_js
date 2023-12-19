import { useSelector, Provider } from 'react-redux';
import { Input } from 'antd';

import store from "./store";
import ApiKey from "./components/apiKey";
import DraggerUpload from "./components/draggerUpload";
import Question from "./components/question";

import './App.css';

function App() {
  const g_fileListResult = useSelector((state) => state.g_fileListResult);
  const g_question = useSelector((state) => state.g_question);

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
