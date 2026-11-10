import React from 'react'
import { Check } from 'lucide-react'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode
  description?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id, className = '', checked, disabled, ...props }, ref) => {
    const checkboxId =
      id || (typeof label === 'string' ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined)

    return (
      <label
        htmlFor={checkboxId}
        className={`flex items-start gap-2.5 cursor-pointer select-none group ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`w-4 h-4 rounded-md border transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[#19B8CD] peer-focus-visible:ring-offset-1 ${
              checked
                ? 'bg-[#19B8CD] border-[#19B8CD] text-white shadow-2xs'
                : 'bg-white border-slate-300 group-hover:border-slate-400'
            }`}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <div className="text-xs">
          <span className="font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
            {label}
          </span>
          {description && (
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {description}
            </p>
          )}
        </div>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

