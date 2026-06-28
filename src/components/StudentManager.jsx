import { useState, useMemo } from 'react'
import useStore from '../stores/useStore'

export default function StudentManager({ onClose }) {
  const classes = useStore((s) => s.classes)
  const students = useStore((s) => s.students)
  const selectedClassId = useStore((s) => s.selectedClassId)
  const setSortMode = useStore((s) => s.setSortMode)
  const addStudent = useStore((s) => s.addStudent)
  const updateStudent = useStore((s) => s.updateStudent)
  const deleteStudent = useStore((s) => s.deleteStudent)
  const reorderStudents = useStore((s) => s.reorderStudents)

  const [activeClassId, setActiveClassId] = useState(selectedClassId)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const scoreHistory = useStore((s) => s.scoreHistory)

  const activeCls = classes.find((c) => c.id === activeClassId)
  const sortMode = activeCls?.sortMode || 'name'

  const classStudents = useMemo(() => {
    const filtered = students.filter((s) => s.classId === activeClassId)
    if (sortMode === 'custom') {
      return [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }
    if (sortMode === 'score') {
      const getTotal = (id) => scoreHistory.filter((h) => h.studentId === id).reduce((sum, h) => sum + h.points, 0)
      return [...filtered].sort((a, b) => getTotal(b.id) - getTotal(a.id))
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  }, [students, activeClassId, sortMode, scoreHistory])

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name || !activeClassId) return
    await addStudent(activeClassId, name)
    setNewName('')
  }

  const handleStartEdit = (student) => {
    setEditingId(student.id)
    setEditName(student.name)
  }

  const handleSaveEdit = async () => {
    const name = editName.trim()
    if (!name) return
    await updateStudent(editingId, { name })
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    await deleteStudent(id)
    setConfirmDeleteId(null)
  }

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= classStudents.length) return
    const ids = classStudents.map((s) => s.id)
    ;[ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]]
    await reorderStudents(activeClassId, ids)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-800">학생 관리</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {classes.length > 0 && (
            <div className="flex gap-1.5 mb-4 overflow-auto pb-1 scrollbar-thin">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setActiveClassId(cls.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-all ${
                    activeClassId === cls.id
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          )}

          {!activeClassId && (
            <p className="text-sm text-slate-300 text-center py-4">반을 먼저 추가해주세요</p>
          )}

          {activeClassId && (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  placeholder="학생 이름"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                >
                  추가
                </button>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {classStudents.length}명
                </span>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  {[
                    { key: 'name', label: '가나다순' },
                    { key: 'score', label: '점수높은순' },
                    { key: 'custom', label: '사용자지정순' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSortMode(activeClassId, key)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        sortMode === key
                          ? 'bg-white text-slate-700 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 max-h-64 overflow-auto scrollbar-thin">
                {classStudents.length === 0 && (
                  <p className="text-sm text-slate-300 text-center py-4">학생이 없습니다</p>
                )}
                {classStudents.map((student, index) => (
                  <div key={student.id} className="group flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    {editingId === student.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          className="flex-1 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
                          autoFocus
                        />
                        <button onClick={handleSaveEdit} className="p-1 text-brand-600 hover:text-brand-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-slate-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </>
                    ) : confirmDeleteId === student.id ? (
                      <>
                        <span className="flex-1 text-sm text-red-500 font-medium">정말 삭제하시겠습니까?</span>
                        <button onClick={() => handleDelete(student.id)} className="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">
                          삭제
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-0.5 text-xs font-semibold text-slate-500 bg-gray-100 rounded-lg hover:bg-gray-200">
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        {sortMode === 'custom' && (
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                              onClick={() => handleMove(index, -1)}
                              disabled={index === 0}
                              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                            </button>
                            <button
                              onClick={() => handleMove(index, 1)}
                              disabled={index === classStudents.length - 1}
                              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                          </div>
                        )}
                        <span className="flex-1 text-sm font-medium text-slate-700">{student.name}</span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleStartEdit(student)} className="p-1 text-slate-400 hover:text-brand-600 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                          </button>
                          <button onClick={() => setConfirmDeleteId(student.id)} className="p-1 text-slate-400 hover:text-red-500 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
