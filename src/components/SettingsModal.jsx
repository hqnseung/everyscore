import { useState } from 'react'
import useStore from '../stores/useStore'

export default function SettingsModal({ onClose }) {
  const loadAll = useStore((s) => s.loadAll)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleExport = async () => {
    await window.api.exportData()
  }

  const handleImport = async () => {
    const success = await window.api.importData()
    if (success) await loadAll()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={confirmReset ? undefined : onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-800">설정</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">데이터 관리</p>
            <div className="space-y-1.5">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div className="text-left">
                  <p>데이터 내보내기</p>
                  <p className="text-xs text-slate-400">JSON 파일로 백업합니다</p>
                </div>
              </button>
              <button
                onClick={handleImport}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <div className="text-left">
                  <p>데이터 가져오기</p>
                  <p className="text-xs text-slate-400">백업 파일에서 복원합니다</p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">위험 영역</p>
            {confirmReset ? (
              <div className="px-3 py-3 rounded-xl bg-red-50">
                <p className="text-sm font-medium text-red-600 mb-2">모든 반, 학생, 점수 기록이 삭제됩니다.</p>
                <div className="flex gap-2">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        await window.api.resetData()
                      } catch {}
                      await loadAll()
                      setConfirmReset(false)
                      onClose()
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                <div className="text-left">
                  <p>데이터 초기화</p>
                  <p className="text-xs text-red-300">모든 데이터를 삭제합니다</p>
                </div>
              </button>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">정보</p>
            <div className="px-3 py-2 text-sm text-slate-400 space-y-1">
              <p>에브리스코어 v1.0.0</p>
              <p>개발자: 한승우 (me@hsw.im)</p>
              <p className="text-xs">Copyright © 2026 Han Seungwoo. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
