import { useState, useMemo } from 'react'
import useStore from '../stores/useStore'
import StudentCard from './StudentCard'
import StudentModal from './StudentModal'

export default function StudentGrid({ scoreView, selectMode, selectedIds, onToggleSelect }) {
  const students = useStore((s) => s.students)
  const selectedClassId = useStore((s) => s.selectedClassId)
  const classes = useStore((s) => s.classes)
  const isFullscreen = useStore((s) => s.isFullscreen)
  const sortMode = useStore((s) => s.getSortMode())
  const scoreHistory = useStore((s) => s.scoreHistory)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const classStudents = useMemo(() => {
    const filtered = students.filter((s) => s.classId === selectedClassId)
    if (sortMode === 'custom') {
      return [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }
    if (sortMode === 'score') {
      const getTotal = (id) => scoreHistory.filter((h) => h.studentId === id).reduce((sum, h) => sum + h.points, 0)
      return [...filtered].sort((a, b) => getTotal(b.id) - getTotal(a.id))
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  }, [students, selectedClassId, sortMode, scoreHistory])

  const gridStyle = useMemo(() => {
    if (classStudents.length === 0) return {}
    const count = classStudents.length
    const cols = Math.ceil(Math.sqrt(count))
    const rows = Math.ceil(count / cols)
    return {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
    }
  }, [classStudents.length])

  if (classes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
          </div>
          <p className="text-slate-500 font-medium">반을 먼저 추가해주세요</p>
          <p className="text-sm text-slate-400 mt-1">좌측 사이드바의 '반 관리'를 클릭하세요</p>
        </div>
      </div>
    )
  }

  if (!selectedClassId) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-slate-400">반을 선택해주세요</p>
      </div>
    )
  }

  if (classStudents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <p className="text-slate-500 font-medium">학생이 없습니다</p>
          <p className="text-sm text-slate-400 mt-1">좌측 사이드바의 '학생 관리'에서 학생을 추가하세요</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`grid h-full ${isFullscreen ? 'gap-3' : 'gap-2'}`}
        style={gridStyle}
      >
        {classStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            scoreView={scoreView}
            isFullscreen={isFullscreen}
            selectMode={selectMode}
            isSelected={selectedIds.has(student.id)}
            onToggleSelect={onToggleSelect}
            onClick={() => setSelectedStudent(student)}
          />
        ))}
      </div>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  )
}
