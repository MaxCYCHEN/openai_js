// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
const child_process = require('node:child_process');
// const rimraf =  require ( 'rimraf' );

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
  contextBridge.exposeInMainWorld("child_process", child_process);
  contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
});