import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  eyebrow?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  headerDark?: boolean
  /**
   * 'default' : la fenêtre grandit avec son contenu (défilement de la page).
   * 'panel'   : hauteur bornée au viewport, en-tête fixe et corps géré par l'enfant
   *             (bottom-sheet sur mobile, fenêtre centrée sur desktop).
   */
  layout?: 'default' | 'panel'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  eyebrow,
  children,
  footer,
  size = 'md',
  headerDark = false,
  layout = 'default',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const isPanel = layout === 'panel'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={
        isPanel
          ? 'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-6 animate-in fade-in duration-200'
          : 'fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'
      }
    >
      <div
        ref={modalRef}
        className={
          isPanel
            ? `relative bg-white w-full flex flex-col overflow-hidden shadow-2xl border border-slate-200 rounded-t-3xl sm:rounded-2xl max-h-[94dvh] sm:max-h-[min(86dvh,760px)] ${sizeClasses[size]}`
            : `relative bg-white rounded-2xl shadow-2xl w-full border border-slate-200 overflow-hidden my-8 ${sizeClasses[size]}`
        }
      >
        {/* Header */}
        {(title || eyebrow) && (
          <div
            className={`relative ${
              isPanel ? 'shrink-0 px-5 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-4 pr-14' : 'p-6'
            } ${
              headerDark
                ? 'bg-[#0B1730] text-white'
                : 'bg-white border-b border-slate-100 text-slate-900'
            }`}
          >
            {/* Poignée visuelle du bottom-sheet (mobile uniquement) */}
            {isPanel && (
              <div aria-hidden="true" className="sm:hidden mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            )}

            <button
              type="button"
              onClick={onClose}
              className={`absolute ${isPanel ? 'top-5 sm:top-4' : 'top-4'} right-4 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#19B8CD] ${
                headerDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Fermer la boîte de dialogue"
            >
              <X className="w-5 h-5" />
            </button>

            {eyebrow && <div className="mb-2">{eyebrow}</div>}
            {title && (
              <h3
                className={`font-heading font-extrabold tracking-tight ${
                  isPanel ? 'text-base sm:text-xl truncate' : 'text-lg sm:text-xl'
                }`}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                className={`text-xs mt-1 ${isPanel ? 'hidden sm:block' : ''} ${
                  headerDark ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className={isPanel ? 'flex-1 min-h-0 flex flex-col' : 'p-6'}>{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className={`${
              isPanel ? 'shrink-0 ' : ''
            }p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

