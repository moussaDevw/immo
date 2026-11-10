import React from 'react'

export type BadgeVariant =
  | 'default'
  | 'navy'
  | 'cyan'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'
  | 'muted'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  pulse?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    navy: 'bg-[#0B1730] text-white border-transparent',
    cyan: 'bg-[#19B8CD]/15 text-[#0f8291] border-[#19B8CD]/30',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    muted: 'bg-slate-50 text-slate-500 border-slate-200',
  }

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-slate-400',
    navy: 'bg-[#19B8CD]',
    cyan: 'bg-[#19B8CD]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    outline: 'bg-slate-400',
    muted: 'bg-slate-400',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1 font-semibold uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-bold',
  }

  return (
    <span
      className={`inline-flex items-center border shadow-2xs ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  )
}

