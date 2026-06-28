import { useState } from 'react'
import useStore from '../stores/useStore'

export default function BulkScoreModal({ targetIds, targetCount, onClose }) {
  const addBulkScore = useStore((s) => s.addBulkScore)

  const [points, setPoints] = useState(0)
  const [reason, setReason] = useState('')

  const handleApply = async () => {
    if (points === 0 || targetIds.length === 0) return
    await addBulkScore(targetIds, points, reason)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-800">{targetCount}명에게 점수 부여</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
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

          <div className="flex gap-2 mb-4">
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
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              placeholder="사유 (선택)"
              autoFocus
            />
          </div>

          <button
            onClick={handleApply}
            disabled={points === 0}
            className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {targetCount}명에게 {points > 0 ? '+' : ''}{points}점 적용
          </button>
        </div>
      </div>
    </div>
  )
}
