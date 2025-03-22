const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    // Bridge API methods
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    
    // Event listeners
    onExportData: (callback) => {
      ipcRenderer.on('menu-export-data', () => callback());
      return () => {
        ipcRenderer.removeListener('menu-export-data', callback);
      };
    },
    
    // Platform information
    platform: process.platform,
    
    // App info
    appVersion: process.env.npm_package_version,
    
    // System capabilities
    isDev: process.env.NODE_ENV === 'development',
    
    // Utility to safely store data
    safeStorage: {
      // Store sensitive data securely
      encrypt: (data) => {
        try {
          // In a real implementation, we would use Electron's safeStorage API
          // For now, we'll use this as a placeholder
          const encoded = Buffer.from(data).toString('base64');
          return encoded;
        } catch (error) {
          console.error('Error encrypting data:', error);
          return null;
        }
      },
      
      // Retrieve securely stored data
      decrypt: (data) => {
        try {
          // In a real implementation, we would use Electron's safeStorage API
          // For now, we'll use this as a placeholder
          const decoded = Buffer.from(data, 'base64').toString('utf8');
          return decoded;
        } catch (error) {
          console.error('Error decrypting data:', error);
          return null;
        }
      }
    }
  }
); 