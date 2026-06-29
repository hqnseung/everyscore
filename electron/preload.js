const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getClasses: () => ipcRenderer.invoke('get-classes'),
  addClass: (cls) => ipcRenderer.invoke('add-class', cls),
  updateClass: (id, updates) => ipcRenderer.invoke('update-class', id, updates),
  deleteClass: (id) => ipcRenderer.invoke('delete-class', id),

  getStudents: () => ipcRenderer.invoke('get-students'),
  addStudent: (student) => ipcRenderer.invoke('add-student', student),
  updateStudent: (id, updates) => ipcRenderer.invoke('update-student', id, updates),
  deleteStudent: (id) => ipcRenderer.invoke('delete-student', id),

  getScoreHistory: () => ipcRenderer.invoke('get-score-history'),
  addScore: (entry) => ipcRenderer.invoke('add-score', entry),
  addBulkScore: (studentIds, points, reason, createdAt) =>
    ipcRenderer.invoke('add-bulk-score', studentIds, points, reason, createdAt),
  updateScore: (id, updates) => ipcRenderer.invoke('update-score', id, updates),
  deleteScore: (id) => ipcRenderer.invoke('delete-score', id),

  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (updates) => ipcRenderer.invoke('update-settings', updates),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: () => ipcRenderer.invoke('import-data'),
  resetData: () => ipcRenderer.invoke('reset-data'),
})
