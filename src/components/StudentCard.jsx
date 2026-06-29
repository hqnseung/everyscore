import { useMemo } from 'react'
import useStore from '../stores/useStore'
import { isToday } from '../utils/dateUtils'

export default function StudentCard({ student, scoreView, isFullscreen, onClick, selectMode, isSelected, onToggleSelect }) {
  const scoreHistory = useStore((s) => s.scoreHistory)
  const fontScale = useStore((s) => s.fontScale)

  const { totalScore, todayScore } = useMemo(() => {
    const records = scoreHistory.filter((h) => h.studentId === student.id)
    const total = records.reduce((sum, h) => sum + h.points, 0)
    const today = records.filter((h) => isToday(h.createdAt)).reduce((sum, h) => sum + h.points, 0)
    return { totalScore: total, todayScore: today }
  }, [scoreHistory, student.id])

  const displayScore = scoreView === 'today' ? todayScore : totalScore
  const showCheckbox = selectMode || false
  const s = fontScale

  const handleCheckbox = (e) => {
    e.stopPropagation()
    onToggleSelect(student.id)
  }

  return (
    <button
      onClick={selectMode ? () => onToggleSelect(student.id) : onClick}
      className={`group relative flex flex-col justify-between h-full p-[clamp(0.6rem,1.2vw,1.75rem)] rounded-2xl border shadow-sm transition-colors duration-150 cursor-pointer overflow-hidden text-left ${
        isSelected
          ? 'bg-brand-50 border-brand-400'
          : 'bg-white border-gray-200/60 hover:border-brand-300'
      }`}
    >
      <div
        onClick={handleCheckbox}
        className={`absolute top-[clamp(0.4rem,0.8vw,1rem)] right-[clamp(0.4rem,0.8vw,1rem)] w-[clamp(1rem,1.3vw,1.5rem)] h-[clamp(1rem,1.3vw,1.5rem)] rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
          isSelected
            ? 'bg-brand-600 border-brand-600'
            : 'border-gray-300 bg-white'
        } ${showCheckbox ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        {isSelected && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <span
        className="font-semibold text-slate-500 group-hover:text-brand-600 transition-colors leading-tight"
        style={{ fontSize: `calc(${isFullscreen ? 'clamp(1rem,1.6vw,2.5rem)' : 'clamp(0.8rem,1.2vw,2.5rem)'} * ${s})` }}
      >
        {student.name}
      </span>

      <div className="self-end mt-auto flex flex-col items-end">
        {scoreView === 'total' && todayScore !== 0 && (
          <span
            className={`font-bold ${todayScore > 0 ? 'text-emerald-500' : 'text-red-400'}`}
            style={{ fontSize: `calc(${isFullscreen ? 'clamp(0.75rem,1.1vw,1.5rem)' : 'clamp(0.6rem,0.85vw,1.25rem)'} * ${s})` }}
          >
            {todayScore > 0 ? '+' : ''}{todayScore}
          </span>
        )}
        <span
          className={`font-extrabold tabular-nums tracking-tight leading-none ${
            displayScore >= 0 ? 'text-slate-800' : 'text-red-500'
          }`}
          style={{ fontSize: `calc(${isFullscreen ? 'clamp(1.5rem,3vw,5rem)' : 'clamp(1.25rem,2.2vw,5rem)'} * ${s})` }}
        >
          {displayScore}
        </span>
      </div>
    </button>
  )
}
