import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text'
  width?: string | number
  height?: string | number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  }

  return (
    <div
      aria-hidden="true"
      className={`bg-slate-200/80 animate-pulse ${variantStyles[variant]} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  )
}

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-0 overflow-hidden shadow-xs space-y-4">
      <Skeleton height={240} className="w-full rounded-b-none" />
      <div className="p-5 space-y-3">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="85%" height={20} />
        <Skeleton variant="text" width="60%" />
        <div className="pt-2 flex items-center justify-between">
          <Skeleton variant="text" width="50%" height={24} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </div>
      </div>
    </div>
  )
}

