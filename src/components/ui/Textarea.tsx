import React from 'react'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      className = '',
      disabled,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined)
    const errorId = textareaId ? `${textareaId}-error` : undefined
    const helperId = textareaId ? `${textareaId}-helper` : undefined

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-700"
          >
            {label}
            {props.required && !label.includes('*') && (
              <span className="text-rose-500 ml-1">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 p-3 transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed resize-y ${
            error
              ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
              : 'border-slate-200 hover:border-slate-300'
          } ${className}`}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-[11px] font-medium text-rose-600 mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[11px] text-slate-500 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

