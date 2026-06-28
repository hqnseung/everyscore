import { useState } from 'react'
import useStore from '../stores/useStore'
import ClassManager from './ClassManager'
import StudentManager from './StudentManager'
import SettingsModal from './SettingsModal'

export default function Sidebar() {
  const classes = useStore((s) => s.classes)
  const students = useStore((s) => s.students)
  const selectedClassId = useStore((s) => s.selectedClassId)
  const selectClass = useStore((s) => s.selectClass)
  const [showClassManager, setShowClassManager] = useState(false)
  const [showStudentManager, setShowStudentManager] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200/60 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-brand-600 tracking-tight">에브리스코어</h2>
          <p className="text-xs text-slate-400 mt-0.5">학생 점수 관리</p>
        </div>

        <nav className="flex-1 overflow-auto py-3 px-3 scrollbar-thin">
          <p className="px-2 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            반 목록
          </p>
          {classes.length === 0 && (
            <p className="px-2 py-3 text-sm text-slate-300 text-center">
              반을 추가해주세요
            </p>
          )}
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => selectClass(cls.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                selectedClassId === cls.id
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center justify-between">
                <span>{cls.name}</span>
                <span className={`text-xs ${selectedClassId === cls.id ? 'text-brand-400' : 'text-slate-400'}`}>
                  {students.filter((s) => s.classId === cls.id).length}명
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1.5">
          <button
            onClick={() => setShowClassManager(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
            반 관리
          </button>
          <button
            onClick={() => setShowStudentManager(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            학생 관리
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            설정
          </button>
        </div>
      </aside>

      {showClassManager && <ClassManager onClose={() => setShowClassManager(false)} />}
      {showStudentManager && <StudentManager onClose={() => setShowStudentManager(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
