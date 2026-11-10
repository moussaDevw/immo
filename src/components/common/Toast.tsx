import React from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useApp } from '../../context/useApp'

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp()

  if (!toast) return null

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#19B8CD] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  }

  const borderColors = {
    success: 'border-emerald-500/40 bg-white shadow-emerald-950/10',
    error: 'border-rose-500/40 bg-white shadow-rose-950/10',
    info: 'border-[#19B8CD]/40 bg-white shadow-cyan-950/10',
    warning: 'border-amber-500/40 bg-white shadow-amber-950/10',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div
        className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 ${borderColors[toast.type]}`}
      >
        <div className="mt-0.5">{icons[toast.type]}</div>
        <div className="flex-1 pr-2">
          <h5 className="font-heading font-bold text-sm text-slate-900">
            {toast.title}
          </h5>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={hideToast}
          aria-label="Fermer la notification"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
