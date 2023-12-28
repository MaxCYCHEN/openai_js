// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
// const rimraf =  require ( 'rimraf' );

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".

process.once("loaded", () => {
  contextBridge.exposeInMainWorld("api", {
    electron_receive: (type, data) => ipcRenderer.on('electron_send', type, data),
    electron_openai: (key, dir, template, question) => ipcRenderer.send('electron_openai', key, dir, template, question),
  });
});