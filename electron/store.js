const fs = require('fs')
const path = require('path')

let dataPath
let data = { classes: [], students: [], scoreHistory: [] }

function init(userDataPath) {
  dataPath = path.join(userDataPath, 'everyscore-data.json')
  try {
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    }
  } catch {
    data = { classes: [], students: [], scoreHistory: [] }
  }
}

function save() {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

function getClasses() {
  return data.classes
}

function addClass(cls) {
  data.classes.push(cls)
  save()
  return data.classes
}

function updateClass(id, updates) {
  data.classes = data.classes.map((c) => (c.id === id ? { ...c, ...updates } : c))
  save()
  return data.classes
}

function deleteClass(id) {
  data.classes = data.classes.filter((c) => c.id !== id)
  const studentIds = data.students.filter((s) => s.classId === id).map((s) => s.id)
  data.students = data.students.filter((s) => s.classId !== id)
  data.scoreHistory = data.scoreHistory.filter((h) => !studentIds.includes(h.studentId))
  save()
  return data.classes
}

function getStudents() {
  return data.students
}

function addStudent(student) {
  data.students.push(student)
  save()
  return data.students
}

function updateStudent(id, updates) {
  data.students = data.students.map((s) => (s.id === id ? { ...s, ...updates } : s))
  save()
  return data.students
}

function deleteStudent(id) {
  data.students = data.students.filter((s) => s.id !== id)
  data.scoreHistory = data.scoreHistory.filter((h) => h.studentId !== id)
  save()
  return data.students
}

function getScoreHistory() {
  return data.scoreHistory
}

function addScore(entry) {
  data.scoreHistory.push(entry)
  save()
  return data.scoreHistory
}

function addBulkScore(studentIds, points, reason, createdAt) {
  const newEntries = studentIds.map((studentId) => ({
    id: `${Date.now()}-${studentId}-${Math.random().toString(36).slice(2, 7)}`,
    studentId,
    points,
    reason: reason || '',
    createdAt,
  }))
  data.scoreHistory.push(...newEntries)
  save()
  return data.scoreHistory
}

function updateScore(id, updates) {
  data.scoreHistory = data.scoreHistory.map((h) => (h.id === id ? { ...h, ...updates } : h))
  save()
  return data.scoreHistory
}

function deleteScore(id) {
  data.scoreHistory = data.scoreHistory.filter((h) => h.id !== id)
  save()
  return data.scoreHistory
}

function exportAll() {
  return { ...data }
}

function resetAll() {
  data = { classes: [], students: [], scoreHistory: [] }
  save()
}

function importAll(newData) {
  data = { classes: newData.classes, students: newData.students, scoreHistory: newData.scoreHistory }
  save()
}

module.exports = {
  init,
  getClasses,
  addClass,
  updateClass,
  deleteClass,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getScoreHistory,
  addScore,
  addBulkScore,
  updateScore,
  deleteScore,
  exportAll,
  importAll,
  resetAll,
}
