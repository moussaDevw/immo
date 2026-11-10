import React from 'react'
import { Loader2 } from 'lucide-react'

export type ButtonVariant =
  | 'primary'
  | 'cyan'
  | 'secondary'
  | 'outline'
  | 'outline-dark'
  | 'dark'
  | 'ghost'
  | 'destructive'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-heading font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] focus-visible:ring-offset-2 active:scale-[0.98] select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none'

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#0B1730] hover:bg-[#172A46] text-white shadow-xs hover:shadow-md',
      cyan:
        'bg-[#19B8CD] hover:bg-[#1499ab] text-slate-950 shadow-sm hover:shadow-md',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
      outline:
        'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-2xs',
      'outline-dark':
        'bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 shadow-xs',
      dark:
        'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-xs',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900',
      destructive:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500',
    }

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs py-1.5 px-3 rounded-lg gap-1.5',
      md: 'text-xs sm:text-sm py-2.5 px-4 rounded-xl gap-2',
      lg: 'text-sm sm:text-base py-3.5 px-6 rounded-xl gap-2.5',
    }

    const widthStyle = fullWidth ? 'w-full' : ''

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

