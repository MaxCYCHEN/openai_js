// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const { OpenAI } = require( "langchain/llms/openai");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { FaissStore } = require("langchain/vectorstores/faiss");
const { BufferMemory } = require("langchain/memory");
const { ConversationalRetrievalQAChain } = require("langchain/chains");

const path = require("path");
const url = require("url");

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname + '/NuTool-CodeGenerator_B-256.ico'),
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      //nodeIntegration: true,
      //enableRemoteModule: true,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
      devTools: true, // Developer Tools
    },
  });

  /**
   * QA system
   * @param {String} key openAIApiKey
   * @param {String} dir The directory of data saved from Python
   * @param {String} template 
   * @param {String} question 
   */
  ipcMain.on('electron_openai', async(event, key, dir, template, question) => {
    try {
      // Load model
      const llm_model = new OpenAI({
        openAIApiKey: key,
        temperature: 0.1,
      });

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: key,
        batchSize: 512, // Default value if omitted is 512. Max is 2048
      });

      // Load the vector store from the directory
      const loadedVectorStore = await FaissStore.loadFromPython(
        path.join(__dirname + dir),
        embeddings
      );

      // Initialize a retriever wrapper around the vector store
      const vectorStoreRetriever = loadedVectorStore.asRetriever(8, "mmr");

      // build the memory
      const memory_QA = new BufferMemory({
        memoryKey: "chat_history",
        inputKey: "question", // The key for the input to the chain
        outputKey: "text", // The key for the final conversational output of the chain
        returnMessages: true, // If using with a chat model (e.g. gpt-3.5 or gpt-4)
      });

      // build the chain finish,
      const chain = ConversationalRetrievalQAChain.fromLLM(
        llm_model,
        vectorStoreRetriever,
        {
          returnSourceDocuments: true,
          memory: memory_QA,
          questionGeneratorChainOptions: {
            template,
          },
        }
      );

      // call the LLM (This one need a buttom)
      const res = await chain.call({
        question,
      });

      mainWindow.webContents.send('electron_send', "response", res);
    }
    catch(e){
      console.error(e);
    }
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    },
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    //if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      //event.preventDefault();
    //}
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.