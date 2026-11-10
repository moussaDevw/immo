import React from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  error?: string
  options?: SelectOption[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      children,
      id,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined)
    const errorId = selectId ? `${selectId}-error` : undefined
    const helperId = selectId ? `${selectId}-helper` : undefined

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700"
          >
            {label}
            {props.required && !label.includes('*') && (
              <span className="text-rose-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative rounded-xl">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full appearance-none bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 pl-3.5 pr-10 py-2.5 transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer ${
              error
                ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                : 'border-slate-200 hover:border-slate-300'
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select'

