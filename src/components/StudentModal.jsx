import { useState, useMemo } from 'react'
import useStore from '../stores/useStore'
import { isToday, formatDate } from '../utils/dateUtils'

export default function StudentModal({ student, onClose }) {
  const scoreHistory = useStore((s) => s.scoreHistory)
  const addScore = useStore((s) => s.addScore)
  const updateScore = useStore((s) => s.updateScore)
  const deleteScore = useStore((s) => s.deleteScore)

  const [points, setPoints] = useState(0)
  const [reason, setReason] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editPoints, setEditPoints] = useState(0)
  const [editReason, setEditReason] = useState('')

  const records = useMemo(
    () =>
      scoreHistory
        .filter((h) => h.studentId === student.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [scoreHistory, student.id]
  )

  const totalScore = records.reduce((sum, h) => sum + h.points, 0)
  const todayScore = records
    .filter((h) => isToday(h.createdAt))
    .reduce((sum, h) => sum + h.points, 0)

  const handleAdd = async () => {
    if (points === 0) return
    await addScore(student.id, points, reason)
    setPoints(0)
    setReason('')
  }

  const handleStartEdit = (record) => {
    setEditingId(record.id)
    setEditPoints(record.points)
    setEditReason(record.reason || '')
  }

  const handleSaveEdit = async () => {
    await updateScore(editingId, { points: editPoints, reason: editReason })
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    await deleteScore(id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-800">{student.name}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-2 gap-3 px-6 py-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">총점</p>
            <p className={`text-2xl font-bold tabular-nums ${totalScore >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
              {totalScore}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">오늘</p>
            <p className={`text-2xl font-bold tabular-nums ${
              todayScore > 0 ? 'text-emerald-600' : todayScore < 0 ? 'text-red-500' : 'text-slate-800'
            }`}>
              {todayScore > 0 ? '+' : ''}{todayScore}
            </p>
          </div>
        </div>

        {/* Score input */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 mb-3">
            {[-5, -1, 1, 5, 10].map((p) => (
              <button
                key={p}
                onClick={() => setPoints((prev) => prev + p)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  p > 0
                    ? 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                    : 'bg-red-50 text-red-500 hover:bg-red-100'
                }`}
              >
                {p > 0 ? '+' : ''}{p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              placeholder="점수"
            />
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              placeholder="사유 (선택)"
            />
            <button
              onClick={handleAdd}
              disabled={points === 0}
              className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              적용
            </button>
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-auto border-t border-gray-100 scrollbar-thin">
          <div className="px-6 py-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              히스토리 ({records.length})
            </p>
            {records.length === 0 && (
              <p className="text-sm text-slate-300 text-center py-6">기록이 없습니다</p>
            )}
            <div className="space-y-1.5">
              {records.map((record) => (
                <div key={record.id} className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  {editingId === record.id ? (
                    <>
                      <input
                        type="number"
                        value={editPoints}
                        onChange={(e) => setEditPoints(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-200"
                      />
                      <input
                        type="text"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="flex-1 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
                        placeholder="사유"
                      />
                      <button onClick={handleSaveEdit} className="text-brand-600 hover:text-brand-700 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-400 w-[72px] flex-shrink-0">
                        {formatDate(record.createdAt)}
                      </span>
                      <span className={`text-sm font-bold w-10 text-center flex-shrink-0 ${
                        record.points > 0 ? 'text-brand-600' : 'text-red-500'
                      }`}>
                        {record.points > 0 ? '+' : ''}{record.points}
                      </span>
                      <span className="flex-1 text-sm text-slate-500 truncate">
                        {record.reason || '-'}
                      </span>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(record)}
                          className="p-1 text-slate-400 hover:text-brand-600 rounded"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
