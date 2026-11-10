import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Une erreur est survenue',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-6 sm:p-8 text-center rounded-2xl bg-rose-50 border border-rose-200/80 shadow-xs space-y-3 max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h4 className="font-heading font-bold text-sm sm:text-base text-rose-950">
          {title}
        </h4>
        <p className="text-xs text-rose-700 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Réessayer
          </Button>
        </div>
      )}
    </div>
  )
}

