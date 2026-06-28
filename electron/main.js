const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const store = require('./store')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    titleBarStyle: 'default',
    show: false,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  store.init(app.getPath('userData'))
  createWindow()

  ipcMain.handle('get-classes', () => store.getClasses())
  ipcMain.handle('add-class', (_, cls) => store.addClass(cls))
  ipcMain.handle('update-class', (_, id, updates) => store.updateClass(id, updates))
  ipcMain.handle('delete-class', (_, id) => store.deleteClass(id))

  ipcMain.handle('get-students', () => store.getStudents())
  ipcMain.handle('add-student', (_, student) => store.addStudent(student))
  ipcMain.handle('update-student', (_, id, updates) => store.updateStudent(id, updates))
  ipcMain.handle('delete-student', (_, id) => store.deleteStudent(id))

  ipcMain.handle('get-score-history', () => store.getScoreHistory())
  ipcMain.handle('add-score', (_, entry) => store.addScore(entry))
  ipcMain.handle('add-bulk-score', (_, studentIds, points, reason, createdAt) =>
    store.addBulkScore(studentIds, points, reason, createdAt)
  )
  ipcMain.handle('update-score', (_, id, updates) => store.updateScore(id, updates))
  ipcMain.handle('delete-score', (_, id) => store.deleteScore(id))

  ipcMain.handle('export-data', async () => {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: '데이터 내보내기',
      defaultPath: `everyscore-backup-${new Date().toISOString().slice(0, 10)}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })
    if (!filePath) return false
    const data = store.exportAll()
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  })

  ipcMain.handle('import-data', async () => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: '데이터 가져오기',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      properties: ['openFile'],
    })
    if (!filePaths || filePaths.length === 0) return false
    const raw = fs.readFileSync(filePaths[0], 'utf-8')
    const data = JSON.parse(raw)
    if (!data.classes || !data.students || !data.scoreHistory) return false
    store.importAll(data)
    return true
  })

  ipcMain.handle('reset-data', () => {
    store.resetAll()
    return true
  })

  ipcMain.handle('toggle-fullscreen', () => {
    const isFullScreen = mainWindow.isFullScreen()
    mainWindow.setFullScreen(!isFullScreen)
    return !isFullScreen
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
