export type TransactionType = 'sale' | 'rent'

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'land'
  | 'office'
  | 'other'

export type PropertyStatus = 'draft' | 'published' | 'archived'

export type DakarNeighborhood =
  | 'Almadies'
  | 'Mermoz'
  | 'Ngor'
  | 'Plateau'
  | 'Point E'
  | 'Sacré-Cœur'
  | 'Mamelles'
  | string

export interface PropertyAgent {
  name: string
  title: string
  phone: string
  email: string
  avatar: string
}

export interface Property {
  id: string
  slug: string
  reference: string
  title: string
  description: string
  transactionType: TransactionType
  propertyType: PropertyType
  price: number // in FCFA (XOF)
  currency: 'XOF'
  neighborhood: DakarNeighborhood
  city: string // 'Dakar'
  addressLabel: string
  surface: number // m²
  bedrooms: number
  bathrooms: number
  parkingSpots?: number
  images: string[]
  amenities: string[]
  highlights?: string[]
  status: PropertyStatus
  featured: boolean
  chargesMonthly?: number
  agencyFees?: number
  agent?: PropertyAgent
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

export type VisitRequestStatus =
  | 'new'
  | 'to_contact'
  | 'scheduled'
  | 'completed'
  | 'cancelled'

export type VisitType = 'presentiel' | 'video'

export interface StatusHistoryEntry {
  status: VisitRequestStatus
  changedAt: string // ISO 8601
  changedBy: string
  note?: string
}

export interface VisitRequest {
  id: string
  propertyId: string
  fullName: string
  phone: string
  email: string
  preferredDate: string // YYYY-MM-DD
  preferredTime: string // ex: '09h - 12h'
  visitType?: VisitType
  message?: string
  status: VisitRequestStatus
  internalAdminNotes?: string
  statusHistory?: StatusHistoryEntry[]
  propertyTitle?: string
  propertyReference?: string
  propertyNeighborhood?: string
  propertyPrice?: number
  propertyTransaction?: TransactionType
  propertyImage?: string
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

export interface FilterState {
  searchQuery: string
  transaction: 'all' | TransactionType
  type: 'all' | PropertyType
  neighborhood: 'all' | DakarNeighborhood
  minPrice: number | ''
  maxPrice: number | ''
  bedrooms: 'all' | '1' | '2' | '3' | '4+'
  minSurface: number | ''
  amenities: string[]
  sortBy: 'pertinence' | 'nouveaute' | 'prix-asc' | 'prix-desc' | 'surface-desc'
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  transaction: 'all',
  type: 'all',
  neighborhood: 'all',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'all',
  minSurface: '',
  amenities: [],
  sortBy: 'pertinence',
}

export type ActiveView =
  | 'home'
  | 'catalog'
  | 'property-detail'
  | 'about'
  | 'admin-dashboard'
  | 'admin-properties'
  | 'admin-requests'
  | 'admin-settings'

export interface AppToast {
  id: string
  type: 'success' | 'info' | 'error' | 'warning'
  title: string
  message: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'Administrateur' | 'Gestionnaire Immobilier'
  avatar: string
}

// Labels en français pour l'affichage UI
export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  sale: 'À Vendre',
  rent: 'À Louer',
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Appartement',
  villa: 'Villa',
  land: 'Terrain',
  office: 'Bureau',
  other: 'Autre',
}

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  draft: 'Brouillon',
  published: 'Publié',
  archived: 'Archivé',
}

export const VISIT_STATUS_LABELS: Record<VisitRequestStatus, string> = {
  new: 'Nouveau',
  to_contact: 'À contacter',
  scheduled: 'Visite planifiée',
  completed: 'Traité',
  cancelled: 'Annulé',
}
