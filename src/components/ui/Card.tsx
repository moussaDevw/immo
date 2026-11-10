import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'muted' | 'dark' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white border-slate-200 text-slate-800 shadow-xs',
    muted: 'bg-slate-50 border-slate-200 text-slate-800 shadow-2xs',
    dark: 'bg-[#0B1730] border-slate-800 text-white shadow-xl',
    outline: 'bg-transparent border-slate-200 text-slate-800',
  }

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300'
    : 'transition-all duration-150'

  return (
    <div
      className={`rounded-2xl border ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

