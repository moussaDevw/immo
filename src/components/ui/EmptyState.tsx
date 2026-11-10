import React from 'react'
import { FolderSearch } from 'lucide-react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FolderSearch className="w-8 h-8 text-slate-400" />,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`p-10 sm:p-14 text-center rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
        {icon}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading font-bold text-base sm:text-lg text-[#0B1730]">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        )}
      </div>

      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  )
}

