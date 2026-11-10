import React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined)
    const errorId = inputId ? `${inputId}-error` : undefined
    const helperId = inputId ? `${inputId}-helper` : undefined

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700"
          >
            {label}
            {props.required && !label.includes('*') && (
              <span className="text-rose-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative rounded-xl">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 ${
              error
                ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                : 'border-slate-200 hover:border-slate-300'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

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

Input.displayName = 'Input'

