
// Preload script for IPC
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startNextJs: () => ipcRenderer.invoke('start-nextjs'),
  openNextApp: () => ipcRenderer.invoke('open-nextapp'),
  onServerUpdate: (callback) => {
    ipcRenderer.on('server-update', (_, data) => callback(data));
  }
});
