import { createContext } from 'react'
import type {
  ActiveView,
  AdminUser,
  AppToast,
  FilterState,
  Property,
  VisitRequest,
  VisitRequestStatus,
} from '../types'

export interface AppContextType {
  // Properties & requests state
  properties: Property[]
  requests: VisitRequest[]
  isLoadingData: boolean

  // Navigation
  activeView: ActiveView
  selectedPropertyId: string | null
  selectedRequestId: string | null
  navigateTo: (view: ActiveView, propertyId?: string, requestId?: string) => void

  // Search & Filters
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  resetFilters: () => void

  // Favorites
  favorites: string[]
  toggleFavorite: (propertyId: string) => void
  isFavorite: (propertyId: string) => boolean

  // Admin authentication
  isAdminAuthenticated: boolean
  isAuthModalOpen: boolean
  adminUser: AdminUser
  openAuthModal: () => void
  closeAuthModal: () => void
  loginAdmin: () => void
  logoutAdmin: () => void

  // Actions: Visit Requests
  submitVisitRequest: (
    data: Omit<VisitRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => Promise<{ success: boolean; request?: VisitRequest; error?: string }>
  updateRequestStatus: (
    id: string,
    status: VisitRequestStatus,
    internalNotes?: string
  ) => void

  // Actions: Properties
  createProperty: (
    data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
  ) => Property
  editProperty: (data: Property) => Property
  removeProperty: (id: string) => boolean

  // Demo utilities
  resetDemoData: () => void

  // Toast notifications
  toast: AppToast | null
  showToast: (toast: Omit<AppToast, 'id'>) => void
  hideToast: () => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

