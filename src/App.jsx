import { useEffect, useState, useCallback } from 'react'
import useStore from './stores/useStore'
import Sidebar from './components/Sidebar'
import StudentGrid from './components/StudentGrid'
import BulkScoreModal from './components/BulkScoreModal'

export default function App() {
  const loadAll = useStore((s) => s.loadAll)
  const isFullscreen = useStore((s) => s.isFullscreen)
  const selectedClassId = useStore((s) => s.selectedClassId)
  const classes = useStore((s) => s.classes)
  const students = useStore((s) => s.students)
  const scoreHistory = useStore((s) => s.scoreHistory)
  const toggleFullscreen = useStore((s) => s.toggleFullscreen)

  const [scoreView, setScoreView] = useState('total')
  const [showBulkScore, setShowBulkScore] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const handleToggleFullscreen = useCallback(async () => {
    const nowFullscreen = await toggleFullscreen()
    setToast(nowFullscreen ? '전체화면으로 전환됨 — ESC로 해제' : '전체화면 해제됨')
    setTimeout(() => setToast(null), 2000)
  }, [toggleFullscreen])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        handleToggleFullscreen()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFullscreen, handleToggleFullscreen])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const selectedClass = classes.find((c) => c.id === selectedClassId)
  const selectMode = selectedIds.size > 0

  const classStudents = students.filter((s) => s.classId === selectedClassId)

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const handleBulkOpen = () => {
    setShowBulkScore(true)
  }

  const handleBulkClose = () => {
    setShowBulkScore(false)
    clearSelection()
  }

  const bulkTargetIds = selectMode
    ? [...selectedIds]
    : classStudents.map((s) => s.id)

  const bulkLabel = selectMode
    ? `${selectedIds.size}명에게 점수 부여`
    : '모두에게 점수 부여'

  const uiScale = useStore((s) => s.uiScale)

  useEffect(() => {
    document.documentElement.style.fontSize = `${uiScale * 16}px`
    return () => { document.documentElement.style.fontSize = '' }
  }, [uiScale])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {!isFullscreen && <Sidebar />}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">
              {selectedClass ? selectedClass.name : '에브리스코어'}
            </h1>
            {selectedClass && (() => {
              const count = classStudents.length
              const total = classStudents.reduce((sum, s) => {
                return sum + scoreHistory.filter((h) => h.studentId === s.id).reduce((a, h) => a + h.points, 0)
              }, 0)
              const avg = count > 0 ? (total / count).toFixed(1) : 0
              return (
                <div className="flex items-center gap-1.5">
                  {[
                    { label: '인원', value: `${count}명` },
                    { label: '총합', value: `${total}점` },
                    { label: '평균', value: `${avg}점` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                      <span className="text-[11px] text-slate-400">{label}</span>
                      <span className="text-xs font-semibold text-slate-600">{value}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
          <div className="flex items-center gap-2">
            {selectedClassId && (
              <>
                {selectMode && (
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    선택 해제
                  </button>
                )}
                <button
                  onClick={handleBulkOpen}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    selectMode
                      ? 'border-brand-300 text-brand-600 bg-brand-50 hover:bg-brand-100'
                      : 'border-gray-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {bulkLabel}
                </button>
                <div className="flex bg-gray-100 rounded-xl p-0.5">
                  <button
                    onClick={() => setScoreView('total')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      scoreView === 'total'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setScoreView('today')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      scoreView === 'today'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    오늘
                  </button>
                </div>
              </>
            )}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={isFullscreen ? '전체화면 해제' : '전체화면'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isFullscreen ? (
                  <>
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                ) : (
                  <>
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </header>

        <div className={`flex-1 overflow-auto scrollbar-thin ${isFullscreen ? 'p-4' : 'p-6'}`}>
          <StudentGrid
            scoreView={scoreView}
            selectMode={selectMode}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        </div>
      </main>

      {showBulkScore && (
        <BulkScoreModal
          targetIds={bulkTargetIds}
          targetCount={bulkTargetIds.length}
          onClose={handleBulkClose}
        />
      )}

      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 bg-black/70 text-white text-sm font-medium rounded-xl animate-fade-toast">
          {toast}
        </div>
      )}
    </div>
  )
}
