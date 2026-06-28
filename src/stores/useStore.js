import { create } from 'zustand'

const useStore = create((set, get) => ({
  classes: [],
  students: [],
  scoreHistory: [],
  selectedClassId: null,
  isFullscreen: false,

  getSortMode: () => {
    const cls = get().classes.find((c) => c.id === get().selectedClassId)
    return cls?.sortMode || 'name'
  },

  setSortMode: async (classId, mode) => {
    if (!classId) return
    const classes = await window.api.updateClass(classId, { sortMode: mode })
    set({ classes })
  },

  loadAll: async () => {
    const [classes, students, scoreHistory] = await Promise.all([
      window.api.getClasses(),
      window.api.getStudents(),
      window.api.getScoreHistory(),
    ])
    const prev = get().selectedClassId
    const selectedClassId = classes.find((c) => c.id === prev) ? prev : (classes.length > 0 ? classes[0].id : null)
    set({ classes, students, scoreHistory, selectedClassId })
  },

  selectClass: (id) => set({ selectedClassId: id }),

  addClass: async (name) => {
    const cls = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }
    const classes = await window.api.addClass(cls)
    const selectedClassId = get().selectedClassId || cls.id
    set({ classes, selectedClassId })
  },

  updateClass: async (id, name) => {
    const classes = await window.api.updateClass(id, { name })
    set({ classes })
  },

  deleteClass: async (id) => {
    const classes = await window.api.deleteClass(id)
    const students = await window.api.getStudents()
    const scoreHistory = await window.api.getScoreHistory()
    let selectedClassId = get().selectedClassId
    if (selectedClassId === id) {
      selectedClassId = classes.length > 0 ? classes[0].id : null
    }
    set({ classes, students, scoreHistory, selectedClassId })
  },

  addStudent: async (classId, name) => {
    const currentStudents = get().students.filter((s) => s.classId === classId)
    const maxOrder = currentStudents.reduce((max, s) => Math.max(max, s.order ?? 0), 0)
    const student = {
      id: crypto.randomUUID(),
      classId,
      name,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
    }
    const students = await window.api.addStudent(student)
    set({ students })
  },

  updateStudent: async (id, updates) => {
    const students = await window.api.updateStudent(id, updates)
    set({ students })
  },

  reorderStudents: async (classId, orderedIds) => {
    let students = get().students
    for (let i = 0; i < orderedIds.length; i++) {
      students = await window.api.updateStudent(orderedIds[i], { order: i })
    }
    set({ students })
  },

  deleteStudent: async (id) => {
    const students = await window.api.deleteStudent(id)
    const scoreHistory = await window.api.getScoreHistory()
    set({ students, scoreHistory })
  },

  addScore: async (studentId, points, reason) => {
    const entry = {
      id: crypto.randomUUID(),
      studentId,
      points,
      reason: reason || '',
      createdAt: new Date().toISOString(),
    }
    const scoreHistory = await window.api.addScore(entry)
    set({ scoreHistory })
  },

  addBulkScore: async (studentIds, points, reason) => {
    const createdAt = new Date().toISOString()
    const scoreHistory = await window.api.addBulkScore(studentIds, points, reason, createdAt)
    set({ scoreHistory })
  },

  updateScore: async (id, updates) => {
    const scoreHistory = await window.api.updateScore(id, updates)
    set({ scoreHistory })
  },

  deleteScore: async (id) => {
    const scoreHistory = await window.api.deleteScore(id)
    set({ scoreHistory })
  },

  toggleFullscreen: async () => {
    const isFullscreen = await window.api.toggleFullscreen()
    set({ isFullscreen })
    return isFullscreen
  },
}))

export default useStore
