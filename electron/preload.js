const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI', {
    // We can expose functions and variables to the renderer process
    getLocalStorage: (key) => {
      return localStorage.getItem(key);
    },
    setLocalStorage: (key, value) => {
      localStorage.setItem(key, value);
    },
    // We'll add more methods later as needed
    platform: process.platform
  }
); 