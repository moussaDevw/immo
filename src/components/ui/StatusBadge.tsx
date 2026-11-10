import React from 'react'
import { Badge } from './Badge'
import type { PropertyStatus, VisitRequestStatus, TransactionType } from '../../types'
import {
  PROPERTY_STATUS_LABELS,
  VISIT_STATUS_LABELS,
  TRANSACTION_LABELS,
} from '../../types'

export interface PropertyStatusBadgeProps {
  status: PropertyStatus
  size?: 'sm' | 'md'
}

export const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const configs: Record<
    PropertyStatus,
    { variant: 'success' | 'warning' | 'muted'; dot: boolean }
  > = {
    published: { variant: 'success', dot: true },
    draft: { variant: 'warning', dot: true },
    archived: { variant: 'muted', dot: false },
  }

  const config = configs[status] || { variant: 'muted', dot: false }

  return (
    <Badge variant={config.variant} size={size} dot={config.dot}>
      {PROPERTY_STATUS_LABELS[status] || status}
    </Badge>
  )
}

export interface VisitStatusBadgeProps {
  status: VisitRequestStatus
  size?: 'sm' | 'md'
}

export const VisitStatusBadge: React.FC<VisitStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const configs: Record<
    VisitRequestStatus,
    {
      variant: 'warning' | 'cyan' | 'default' | 'success' | 'muted'
      dot: boolean
      pulse?: boolean
    }
  > = {
    new: { variant: 'warning', dot: true, pulse: true },
    to_contact: { variant: 'cyan', dot: true },
    scheduled: { variant: 'default', dot: true },
    completed: { variant: 'success', dot: true },
    cancelled: { variant: 'muted', dot: false },
  }

  const config = configs[status] || { variant: 'muted', dot: false }

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={config.dot}
      pulse={config.pulse}
    >
      {VISIT_STATUS_LABELS[status] || status}
    </Badge>
  )
}

export interface TransactionBadgeProps {
  type: TransactionType
  size?: 'sm' | 'md'
}

export const TransactionBadge: React.FC<TransactionBadgeProps> = ({
  type,
  size = 'sm',
}) => {
  return (
    <Badge
      variant={type === 'sale' ? 'navy' : 'cyan'}
      size={size}
    >
      {TRANSACTION_LABELS[type] || type}
    </Badge>
  )
}

