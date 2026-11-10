import React from 'react'

export interface SectionHeadingProps {
  eyebrow?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
}) => {
  const isCentered = align === 'center'

  return (
    <div
      className={`flex flex-col ${
        isCentered
          ? 'items-center text-center'
          : 'md:flex-row md:items-end justify-between'
      } gap-4 mb-10 sm:mb-12 ${className}`}
    >
      <div className={`space-y-2 ${isCentered ? 'max-w-2xl' : 'max-w-3xl'}`}>
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1499ab]">
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#0B1730] tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className={`shrink-0 ${isCentered ? 'pt-2' : 'self-start md:self-auto'}`}>
          {action}
        </div>
      )}
    </div>
  )
}

